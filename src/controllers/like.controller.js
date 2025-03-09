import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = async (req, res) => {
  const { videoId } = req.params;

  // Fetch Video document and check if Video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError({ status: 404, message: "Video does not exist" });
  }

  // Videos exists and liked by user, so unlike it
  const unlike = await Like.findOneAndDelete({
    video: videoId,
    likedBy: req.user._id
  });

  // Response: Video Unliked
  if (unlike) {
    return res.status(200).json(
      new ApiResponse({
        status: 200,
        message: "Video Unliked successfully"
      })
    );
  }

  // Video exists but not liked by user, so like it
  const like = await Like.create({
    likedBy: req.user._id,
    video: videoId
  });

  // Response: Video Liked
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Video Liked successfully",
      data: like
    })
  );
};

export { toggleVideoLike };
