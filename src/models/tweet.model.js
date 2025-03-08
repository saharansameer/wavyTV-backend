import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      required: [true, "tweet cant be empty"],
      match: [
        /[a-zA-Z0-9]/,
        "Tweet content can not be empty and must contain either a letter or a number"
      ]
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
