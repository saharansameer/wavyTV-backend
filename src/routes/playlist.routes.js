import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists
} from "../controllers/playlist.controller.js";

const router = Router();

// User Authorization
router.use(asyncHandler(verifyJWT));

router
  .route("/")
  .get(asyncHandler(getUserPlaylists))
  .post(asyncHandler(createPlaylist));

// Error Handler
router.use(errorHandler);

export default router;
