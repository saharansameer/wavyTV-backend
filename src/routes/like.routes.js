import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleVideoLike,
  toggleTweetLike
} from "../controllers/like.controller.js";

const router = Router();

// POST - Toggle video like
router
  .route("/video/:videoId")
  .post(asyncHandler(verifyJWT), asyncHandler(toggleVideoLike));

// POST - Toggle tweet like
router
  .route("/tweet/:tweetId")
  .post(asyncHandler(verifyJWT), asyncHandler(toggleTweetLike));

// Error Handler
router.use(errorHandler);

export default router;
