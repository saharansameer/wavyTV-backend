import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet
} from "../controllers/tweet.controller.js";

const router = Router();

// POST - create new tweet
router.route("/").post(asyncHandler(verifyJWT), asyncHandler(createTweet));

// GET - fetch tweets by username
router.route("/:username").get(asyncHandler(getUserTweets));

// PATCH - update tweet content
router
  .route("/:tweetId")
  .patch(asyncHandler(verifyJWT), asyncHandler(updateTweet));

// Error Handler
router.use(errorHandler);

export default router;
