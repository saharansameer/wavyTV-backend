import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  uploadVideo,
  getVideoById
} from "../controllers/video.controller.js";

const router = Router();

// GET - fetch all videos
// POST - upload a video
router
  .route("/")
  .get(asyncHandler(getAllVideos))
  .post(
    asyncHandler(verifyJWT),
    upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 }
    ]),
    asyncHandler(uploadVideo)
  );

// GET - fetch video by id
router.route("/:videoId").get(asyncHandler(getVideoById));

// Error Handler
router.use(errorHandler);

export default router;
