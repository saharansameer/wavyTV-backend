import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
    return res.status(200).json(
        new ApiResponse({
            status: 200,
            message: "User fetched successfully",
            data: user
        })
    );
};

const updateUserAccountDetails = async (req, res) => {
    const { fullName, username, email } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullName, username, email } },
        { new: true, runValidators: true }
    );
    if (!user) {
        throw new ApiError({
            status: 400,
            message: "Unable to retrive or update user account details"
        });
    }

    return res.status(200).json(
        new ApiResponse({
            status: 200,
            message: "User account details updated successfully"
        })
    );
};

const updateUserChannelDetails = async (req, res) => {
    // Middleware (verifyJWT) either sends a valid user in response or throws error and stop the process
    const user = await User.findById(req.user._id);

    // Local path of uploaded avatar and coverImage
    // These (.coverImage?. and .avatar?.) checks are useful when user wants to update only one field,
    // either avatar or either coverImage
    const avatarLocalPath = req.files?.avatar?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.coverImage[0]?.path;
  
    // If user dont upload new images for avatar and coverImage
    if (!avatarLocalPath && !coverImageLocalPath) {
        throw new ApiError({status: 400, message: "no changes made by user for avatar and coverImage"})
    }

    if (avatarLocalPath) {
        const newAvatar = await uploadOnCloudinary(avatarLocalPath);
        if (!newAvatar) {
            throw new ApiError({
                status: 400,
                message: "Unable to upload avatar on cloudinary"
            });
        }
        user.avatar = newAvatar.url;
    }
    if (coverImageLocalPath) {
        const newCoverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (!newCoverImage) {
            throw new ApiError({
                status: 400,
                message: "Unable to upload cover image on cloudinary"
            });
        }
        user.coverImage = newCoverImage.url;
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse({
            status: 200,
            message: "Avatar and Cover Image updated successfully"
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

export {
    changeUserPassword,
    getCurrentUser,
    updateUserAccountDetails,
    updateUserChannelDetails
};
