import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json(
        new ApiResponse({
            status: 200,
            message: "User fetched successfully",
            data: user
        })
    );
};

const changeUserPassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Throws an error if any of password field is empty
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError({
            status: 400,
            message: "All password fields are required"
        });
    }

    // Middleware (verifyJWT) either sends a valid user in response or throws error and stop the process
    const user = await User.findById(req.user._id);

    // Checks if currentPassword is correct
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new ApiError({
            status: 400,
            message: "Current Password is incorrect"
        });
    }

    // Checks if newPassword and confirmPassword both matches
    if (newPassword !== confirmPassword) {
        throw new ApiError({
            status: 400,
            message: "New passwords do not match"
        });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse({
            status: 200,
            message: "Password changed successfully"
        })
    );
};

export { changeUserPassword, getCurrentUser };
