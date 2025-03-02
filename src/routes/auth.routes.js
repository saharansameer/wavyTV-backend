import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(asyncHandler(registerUser));

router.route("/signin").post(asyncHandler(loginUser));

router.route("/logout").post(asyncHandler(verifyJWT), asyncHandler(logoutUser));

router.route("/token").post(asyncHandler(refreshAccessToken));

router.use(errorHandler);

export default router;
