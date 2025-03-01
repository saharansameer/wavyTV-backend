import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { cookiesOptions } from "../constants.js";
import jwt from "jsonwebtoken";

// Method for Generate access and refresh tokens
const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError({
            status: 500,
            message: "Unable to Generate Tokens"
        });
    }
};

const registerUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;

    // Checks if any field is empty or not
    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError({ status: 400, message: "All fields are required" });
    }

    // Checks if user already exists or not
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        // Checks if username already exists
        if (userExists.username === username) {
            throw new ApiError({
                status: 409,
                message: "username already exists"
            });
        }
        // Checks if email already exists
        if (userExists.email === email) {
            throw new ApiError({
                status: 409,
                message: "Email already exists"
            });
        }
    }

    // User creation (without validation)
    const user = new User({
        fullName,
        username,
        email,
        password
    });

    // User validation check
    try {
        await user.validate();
    } catch (err) {
        const validationError = [];
        for (const key in err.errors) {
            validationError.push(err.errors[key].message);
        }
        throw new ApiError({
            status: 400,
            message: "Validation Error",
            errors: validationError.join(", ")
        });
    }

    // User creation in database along with successful validation
    try {
        await user.save();
    } catch (err) {
        throw new ApiError({ status: 500, message: err.message });
    }

    return res.json(
        new ApiResponse({
            status: 201,
            message: "User registered successfully!",
            data: { username, email }
        })
    );
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ApiError({
            status: 400,
            message: "Invalid username or password"
        });
    }
    // Finding user using username or email, whatever client send in response
    const user = await User.findOne({
        $or: [{ username: username }, { email: username }]
    });

    // If user not found with the given username or email
    if (!user) {
        throw new ApiError({
            status: 404,
            message: "User not found with the given username or email"
        });
    }

    // If user found, now compare password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError({ status: 401, message: "Password is not valid" });
    }

    // Generating access and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse({
                status: 200,
                message: "User logged in successfully"
            })
        );
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: "" } },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookiesOptions)
        .clearCookie("refreshToken", cookiesOptions)
        .json(
            new ApiResponse({
                status: 200,
                message: "User logged out successfully"
            })
        );
};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError({
            status: 400,
            message: "Refresh Token is not in cookies"
        });
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedToken) {
        throw new ApiError({
            status: 400,
            message: "Refresh token is expired or invalid"
        });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError({
            status: 400,
            message: "Invalid refresh token payload e.g. _id"
        });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError({ status: 400, message: "Tokens does not match" });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse({
                status: 200,
                message: "New accessToken generated successfully"
            })
        );
};

export { registerUser, loginUser, logoutUser, refreshAccessToken };
