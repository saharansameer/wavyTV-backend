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

export { createTweet, getUserTweets };
