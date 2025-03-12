import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getTweetById
} from "../controllers/tweet.controller.js";

const router = Router();

// POST - create new tweet
router.route("/").post(asyncHandler(verifyJWT), asyncHandler(createTweet));

// GET - fetch tweets by username
router.route("/user/:username").get(asyncHandler(getUserTweets));

// GET - fetch tweet by id
// PATCH - update tweet content
// DELETE - delete tweet
router
  .route("/:tweetId")
  .get(asyncHandler(getTweetById))
  .patch(asyncHandler(verifyJWT), asyncHandler(updateTweet))
  .delete(asyncHandler(verifyJWT), asyncHandler(deleteTweet));

// Error Handler
router.use(errorHandler);

export default router;
