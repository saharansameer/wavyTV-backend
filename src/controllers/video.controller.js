import ApiError from "../utils/apiError.js";
import ApiReponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: {}
    }
  ]);
  Video.aggregatePaginate(videos);

  return res
    .status(200)
    .json(
      new ApiReponse({
        status: 200,
        message: "All videos fetched successfully",
        data: videos
      })
    );
};

const uploadVideo = async (req, res) => {
  const { title, description } = req.body;
  // Checks if title is empty
  if (!title) {
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
    title,
    description: description || "",
    owner: req.user._id,
    videoFile: videoFile.url,
    videoFilePublicId: videoFile.public_id,
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

export { getAllVideos, uploadVideo };
