import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getChannelSubscribers
} from "../controllers/subscription.controller.js";
const router = Router();

// User Authorization
router.use(asyncHandler(verifyJWT));

// POST - Toggle channel subscription
router.route("/:channelId").post(asyncHandler(toggleSubscription));

// GET - Fetch all subscribers
router.route("/subscribers").get(asyncHandler(getChannelSubscribers));

// Error Handler
router.use(errorHandler);

export default router;
