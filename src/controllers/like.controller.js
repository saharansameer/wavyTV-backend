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

  // Fetch like document
  const like = await Like.findOne({ video: videoId, likedBy: req.user._id });
  // Video exists but not liked by user, so like it
  if (!like) {
    const likedVideo = await Like.create({
      likedBy: req.user._id,
      video: videoId
    });
    if (!likedVideo) {
      throw new ApiError({ status: 400, message: "Unable to like video" });
    }

    // Response: Video Liked
    return res.status(200).json(
      new ApiResponse({
        status: 200,
        message: "Video Liked successfully"
      })
    );
  }

  // Videos exists and liked by user, so unlike it
  try {
    await Like.findByIdAndDelete(like._id);
  } catch (err) {
    throw new ApiError({ status: 500, message: err.message });
  }

  // Response: Video Unliked
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Video Unliked successfully"
    })
  );
};

export { toggleVideoLike };
