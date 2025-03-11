import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const toggleSubscription = async (req, res) => {
  const { channelId } = req.params;
  // Channel is subscribed by user, so unsubscribe it
  const unsubscribe = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user._id
  });
  // Response: Unsubscribe
  if (unsubscribe) {
    return res.status(200).json(
      new ApiResponse({
        status: 200,
        message: "Channel Unsubscribed successfully"
      })
    );
  }

  // Channel is not subscribed, so subscribe it
  const subscribe = await Subscription.create({
    channel: channelId,
    subscriber: req.user._id
  });

  // Response: Subscribe
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Channel Subscribed successfully",
      data: subscribe
    })
  );
};

const getChannelSubscribers = async (req, res) => {
  // Fetch all subscribers
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: mongoose.isValidObjectId(req.user._id)
          ? new mongoose.Types.ObjectId(req.user._id)
          : null
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
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
        subscriber: {
          $first: "$subscriber"
        }
      }
    },
    {
      $project: {
        subscriber: 1
      }
    }
  ]);
  
  // Checks if channel has any subscriber
  if (subscribers.length === 0) {
    throw new ApiError({ status: 400, message: "Channel has no subscribers" });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Subscribers fetched successfully",
      data: subscribers
    })
  );
};

export { toggleSubscription, getChannelSubscribers };
