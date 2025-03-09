import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

// POST - Toggle video like
router
  .route("/video/:videoId")
  .post(asyncHandler(verifyJWT), asyncHandler(toggleVideoLike));

// Error Handler
router.use(errorHandler);

export default router;
