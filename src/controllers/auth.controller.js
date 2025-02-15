import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    // get user details from FE
    // validation - not empty
    // check is user already exists - username, email
    // check for image and avatar, upload them on cloudinary
    // create user object and create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { fullName, username, email, password } = req.body;

    // checks if any field is empty or not
    if (
        [fullName, username, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // email validation
    const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    if (!emailRegex.test(email)) {
        throw new Error(400, "Email is not valid");
    }

    // checks if user already exists or not
    const userExists = await User.findOne({ $or: [{username},{email}]});
    if (userExists) {
        // checks if username already exists
        if (userExists.username === username) {
            throw new ApiError({status: 409, message: "username already exists"});
        }
        // checks if email already exists
        if (userExists.email === email) {
            throw new ApiError({status: 409, message: "Email already exists"});
        }
    }

    // password validation (not active yet)
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

    // user creation
    const createdUser = await User.create({
        fullName, username, email, password
    });
    // checks if user document created successfully
    if (!createdUser) {
        throw new ApiError({status: 400, message: "Error while creating user"});
    }

    return res.json(new ApiResponse({status: 201, message: "User registered successfully!", data: {username, email}}));



};

export { registerUser };
