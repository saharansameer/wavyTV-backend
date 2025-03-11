import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
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

// POST - add video to playlist
// GET - remove video from playlist (i.e videos array)
router
  .route("/video")
  .post(asyncHandler(addVideoToPlaylist))
  .get(asyncHandler(removeVideoFromPlaylist));

// Error Handler
router.use(errorHandler);

export default router;
