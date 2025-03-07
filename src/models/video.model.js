import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      match: [/[a-zA-Z0-9]/, "Title can not be empty and must contain either a letter or a number"]
    },
    description: {
      type: String,
    },
    duration: {
      type: Number
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    videoFile: {
      type: String,
      required: true
    },
    videoFilePublicId: {
      type: String
    },
    videoFileDisplayName: {
      type: String
    },
    thumbnail: {
      type: String,
      required: true
    },
    thumbnailPublicId: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
