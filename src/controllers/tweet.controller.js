import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = async (req, res) => {
  const { content } = req.body;
  // Remove extra spaces from content
  const trimmedContent = content.trim().replace(/\s+/g, " ");
  // Checks If user sent valid content
  if (!trimmedContent) {
    throw new ApiError({ status: 400, message: "Tweet has no content" });
  }

  // Create Tweet
  const tweet = new Tweet({
    content: trimmedContent,
    owner: req.user._id
  });

  // Save Tweet
  try {
    await tweet.save();
  } catch (err) {
    throw new ApiError({ status: 500, message: err.message });
  }

  // Final Response
  return res.status(201).json(
    new ApiResponse({
      status: 201,
      message: "Tweet created successfully",
      data: tweet
    })
  );
};

const getUserTweets = async (req, res) => {
  const { username } = req.params;

  // Find user by username
  const user = await User.findOne({ username: username });
  // Checks if user exists
  if (!user) {
    throw new ApiError({
      status: 404,
      message: "User not found with the given username"
    });
  }

  // Fetch Tweets
  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: user._id
      }
    },
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
  ]);

  if (!tweets) {
    throw new ApiError({
      status: 404,
      message: "User has created no tweets or unable to fetch"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Tweets fetched successfully",
      data: tweets
    })
  );
};

const updateTweet = async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  // Remove extra spaces from content
  const trimmedContent = content.trim().replace(/\s+/g, " ");
  // Checks If user sent valid content
  if (!trimmedContent) {
    throw new ApiError({ status: 404, message: "Tweet has no content" });
  }

  const tweet = await Tweet.findById(tweetId);
  // Checks if tweet exits
  if (!tweet) {
    throw new ApiError({
      status: 404,
      message: "Tweet not found"
    });
  }

  // Checks if logged in user is the owner of tweet
  if (tweet.owner !== req.user._id) {
    throw new ApiError({
      status: 403,
      message: "User is not authorized to edit this tweet"
    });
  }

  // Update tweet content
  try {
    tweet.content = trimmedContent;
    await tweet.save();
  } catch (err) {
    throw new ApiError({
      status: 500,
      message: "Unable to update tweet content"
    });
  }

  // Final Response
  return res.status(200).json({
    status: 200,
    message: "Tweet updated successfully",
    data: updatedTweet
  });
};

export { createTweet, getUserTweets, updateTweet };
