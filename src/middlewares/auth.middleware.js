import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new ApiError({
            status: 401,
            message: "User is already logged out"
        });
    }

    const loggedInUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(loggedInUser?._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError({ status: 401, message: "Invalid Accedd Token" });
    }
    req.user = user;
    next();
};
