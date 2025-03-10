import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleVideoLike,
  toggleTweetLike,
  toggleCommentLike,
  getLikedVideos
} from "../controllers/like.controller.js";

const router = Router();

// User Authorization
router.use(asyncHandler(verifyJWT));

// GET - Fetch liked videos (by a user)
router.route("/video").get(asyncHandler(getLikedVideos));

// POST - Toggle video like
router.route("/video/:videoId").post(asyncHandler(toggleVideoLike));

// POST - Toggle tweet like
router.route("/tweet/:tweetId").post(asyncHandler(toggleTweetLike));

// POST - Toggle comment like
router.route("/comment/:commentId").post(asyncHandler(toggleCommentLike));

// Error Handler
router.use(errorHandler);

export default router;
