import ApiError from "../utils/apiError.js";
import ApiReponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary
} from "../utils/cloudinary.js";

const getAllVideos = async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: {}
    }
  ]);
  Video.aggregatePaginate(videos);

  return res.status(200).json(
    new ApiReponse({
      status: 200,
      message: "All videos fetched successfully",
      data: videos
    })
  );
};

const uploadVideo = async (req, res) => {
  const { title, description } = req.body;
  // Remove extra spaces from title
  const trimmedTitle = title.trim().replace(/\s+/g, " ");
  // Checks if title is empty
  if (!trimmedTitle) {
    throw new ApiError({ status: 400, message: "Title is mandatory" });
  }

  // Getting local paths of video and thumbnail from multer
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // Checks video and thumnail uploaded on server
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError({
      status: 400,
      message: "Video and Thumbnail both are mandatory"
    });
  }

  // Uploading on clodinary
  const videoFile = await uploadOnCloudinary(videoLocalPath, "video", "videos");
  const thumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    "image",
    "thumbnails"
  );

  // Checks if video and thumbnail were uploaded to cloudinary or not
  if (!videoFile || !thumbnail) {
    throw new ApiError({
      status: 500,
      message: "Unable to upload video and thumbnail on cloudinary"
    });
  }

  // Creating Video Document
  const video = new Video({
    title: trimmedTitle,
    description: description?.trim().replace(/\s+/g, " ") || "",
    owner: req.user._id,
    videoFile: videoFile.url,
    videoFilePublicId: videoFile.public_id,
    videoFileDisplayName: videoFile.display_name,
    thumbnail: thumbnail.url,
    thumbnailPublicId: thumbnail.public_id
  });

  // Saving Video document on DB
  try {
    await video.save();
  } catch (err) {
    throw new ApiError({
      status: 500,
      message: "Unable to save video document"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiReponse({
      status: 200,
      message: "Video along with Thumbnail uploaded successfully"
    })
  );
};

const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.aggregate([
    {
      $match: {
        videoFileDisplayName: videoId
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
              username: 1,
              fullName: 1,
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

  return res.status(200).json(
    new ApiReponse({
      status: 200,
      message: "Video fetched successfully",
      data: video
    })
  );
};

const updateVideoDetails = async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // Fetch video document by ID
  const video = await Video.findOne({ videoFileDisplayName: videoId });
  if (!video) {
    throw new ApiError({ status: 400, message: "Video does not exist" });
  }

  // Update title and description (If provided)
  if (title !== undefined) {
    const trimmedTitle = title.trim().replace(/\s+/g, " ");
    video.title = trimmedTitle;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
    const trimmedDescription = description.trim().replace(/\s+/g, " ");
    video.description = trimmedDescription;
  }

  // Validation after updating Title and Description
  try {
    video.validateSync();
  } catch (err) {
    throw new ApiError({ status: 400, message: err.message });
  }

  // Handle Thumbnail Update (if provided)
  if (thumbnailLocalPath) {
    // Upload new thumbnail
    const thumbnail = await uploadOnCloudinary(
      thumbnailLocalPath,
      "image",
      "thumbnails"
    );

    // Checks for issue while uploading new thumbnail
    if (!thumbnail) {
      throw new ApiError({
        status: 500,
        message: "Unable to update thumbnail"
      });
    }

    // Delete old thumbnail
    try {
      await deleteImageFromCloudinary(video.thumbnailPublicId);
    } catch (err) {
      throw new ApiError({ status: 500, message: err.message });
    }

    // Update thumbnail details in DB
    video.thumbnail = thumbnail.url;
    video.thumbnailPublicId = thumbnail.public_id;
  }

  // Save Changes (title, description, thumbnail)
  await video.save();

  return res.status(200).json(
    new ApiReponse({
      status: 200,
      message: "Video details updated successfully",
      data: video
    })
  );
};

export { getAllVideos, uploadVideo, getVideoById, updateVideoDetails };
