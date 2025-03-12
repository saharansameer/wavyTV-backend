import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateUserAccountDetails,
  updateUserChannelDetails,
  changeUserPassword,
  getUserChannelProfile,
  getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// GET - current user details
// PATCH - fullname, username, email
router
  .route("/")
  .get(asyncHandler(verifyJWT), asyncHandler(getCurrentUser))
  .patch(asyncHandler(verifyJWT), asyncHandler(updateUserAccountDetails));

// GET - User Channel Profile
// PATCH - avatar, coverImage
router
  .route("/channel/:username")
  .get(asyncHandler(getUserChannelProfile))
  .patch(
    asyncHandler(verifyJWT),
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 }
    ]),
    asyncHandler(updateUserChannelDetails)
  );

// PATCH - password
router
  .route("/security")
  .patch(asyncHandler(verifyJWT), asyncHandler(changeUserPassword));

// GET - User Watch History
router
  .route("/history")
  .get(asyncHandler(verifyJWT), asyncHandler(getUserWatchHistory));

// Error Handler
router.use(errorHandler);

export default router;
