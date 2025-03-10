import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCommentToVideo,
  addCommentToTweet
} from "../controllers/comment.controller.js";

const router = Router();

// POST - add comment on video
router
  .route("/video/:videoId")
  .post(asyncHandler(verifyJWT), asyncHandler(addCommentToVideo));

// POST - add comment on tweet
router
  .route("/tweet/:tweetId")
  .post(asyncHandler(verifyJWT), asyncHandler(addCommentToTweet));

// Error Handler
router.use(errorHandler);

export default router;
