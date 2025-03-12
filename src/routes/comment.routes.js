import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCommentToVideo,
  addCommentToTweet,
  updateComment,
  deleteComment,
  getVideoComments,
  getTweetComments
} from "../controllers/comment.controller.js";

const router = Router();

// GET - fetch video comments
// POST - add comment on video
router
  .route("/video/:videoId")
  .get(asyncHandler(getVideoComments))
  .post(asyncHandler(verifyJWT), asyncHandler(addCommentToVideo));

// GET - fetch tweet comments
// POST - add comment on tweet
router
  .route("/tweet/:tweetId")
  .get(asyncHandler(getTweetComments))
  .post(asyncHandler(verifyJWT), asyncHandler(addCommentToTweet));

// PATCH - update comment
// DELETE - delete comment
router
  .route("/:commentId")
  .patch(asyncHandler(verifyJWT), asyncHandler(updateComment))
  .delete(asyncHandler(verifyJWT), asyncHandler(deleteComment));

// Error Handler
router.use(errorHandler);

export default router;
