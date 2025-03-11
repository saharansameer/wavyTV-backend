import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";
const router = Router();

// User Authorization
router.use(asyncHandler(verifyJWT));

router.route("/subscribe/:channelId").post(asyncHandler(toggleSubscription));

// Error Handler
router.use(errorHandler);

export default router;
