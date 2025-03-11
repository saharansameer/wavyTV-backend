import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Playlist title is required"],
      match: [/[a-zA-Z0-9]/, "Title can not be empty"]
    },
    description: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
