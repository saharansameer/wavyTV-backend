import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

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

const toggleTweetLike = async (req, res) => {
  const { tweetId } = req.params;

  // Fetch Tweet document and check if Tweet exists
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError({ status: 404, message: "Tweet does not exist" });
  }

  // Tweet exists and liked by user, so unlike it
  const unlike = await Like.findOneAndDelete({
    tweet: tweetId,
    likedBy: req.user._id
  });

  // Response: Tweet Unliked
  if (unlike) {
    return res
      .status(200)
      .json(
        new ApiResponse({ status: 200, message: "Tweet unliked successfully" })
      );
  }

  // Tweet exists but not liked by user, so like it
  const like = await Like.create({
    likedBy: req.user._id,
    tweet: tweetId
  });

  // Response: Tweet Liked
  return res
    .status(200)
    .json({ status: 200, message: "Tweet liked successfully", data: like });
};

const toggleCommentLike = async (req, res) => {
  const { commentId } = req.params;

  // Fetch Comment document and check if Comment exists
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError({ status: 404, message: "Comment does not exist" });
  }

  // Comment exists and liked by user, so unlike it
  const unlike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user._id
  });

  // Response: Comment Unliked
  if (unlike) {
    return res.status(200).json(
      new ApiResponse({
        status: 200,
        message: "Comment unliked successfully"
      })
    );
  }

  // Comment exists but not liked by user, so like it
  const like = await Like.create({
    comment: commentId,
    likedBy: req.user._id
  });

  // Response: Comment Liked
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Comment liked successfully",
      data: like
    })
  );
};

const getLikedVideos = async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: mongoose.isValidObjectId(req.user._id)
          ? new mongoose.Types.ObjectId(req.user._id)
          : null,
        video: { $exists: true, $ne: null }
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
        ]
      }
    },
    {
      $addFields: {
        video: {
          $first: "$video"
        }
      }
    }
  ]);

  if (likedVideos.length === 0) {
    throw new ApiError({
      status: 400,
      message: "User has not liked any video"
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Videos liked by user fetched successfully",
    data: likedVideos
  });
};

export { toggleVideoLike, toggleTweetLike, toggleCommentLike, getLikedVideos };
