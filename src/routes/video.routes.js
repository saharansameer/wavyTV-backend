import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, uploadVideo } from "../controllers/video.controller.js";

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

// Error Handler
router.use(errorHandler);

export default router
