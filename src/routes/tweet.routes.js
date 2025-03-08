import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweet.controller.js";

const router = Router();

// POST - create new tweet
router.route("/").post(asyncHandler(verifyJWT), asyncHandler(createTweet));

// Error Handler
router.use(errorHandler);

export default router;
