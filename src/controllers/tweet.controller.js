import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Tweet } from "../models/tweet.model.js";

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

export { createTweet };
