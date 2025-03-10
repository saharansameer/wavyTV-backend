import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";

const addCommentToVideo = async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  // Create Comment
  const comment = await Comment.create({
    content: content,
    video: videoId,
    commentBy: req.user._id
  });
  // Checks for issue while creating comment document
  if (!comment) {
    throw new ApiError({
      status: 500,
      message: "Unable to add comment on video"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment added successfully",
      data: comment
    })
  );
};

const addCommentToTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  // Creating Comment
  const comment = await Comment.create({
    content: content,
    tweet: tweetId,
    commentBy: req.user._id
  });
  // Checks for issue while creating comment document
  if (!comment) {
    throw new ApiError({
      status: 500,
      message: "Unable to add comment on tweet"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment added successfully",
      data: comment
    })
  );
};

export { addCommentToVideo, addCommentToTweet };
