import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

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

export { toggleSubscription };
