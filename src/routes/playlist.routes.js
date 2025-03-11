import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

// User Authorization
router.use(asyncHandler(verifyJWT));

// GET - fetch all playlists
// POST - create playlist
router
  .route("/")
  .get(asyncHandler(getUserPlaylists))
  .post(asyncHandler(createPlaylist));

// PATCH - update playlist details (i.e title or description)
// DELETE - delete playlist permanently
router
  .route("/:playlistId")
  .patch(asyncHandler(updatePlaylist))
  .delete(asyncHandler(deletePlaylist));

// Error Handler
router.use(errorHandler);

export default router;
