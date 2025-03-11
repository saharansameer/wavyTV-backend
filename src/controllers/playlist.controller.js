import ApiError from "../utils/apiResponse.js";
import ApiResponse from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = async (req, res) => {
  const { title, description } = req.body;
  // Remove extra spaces from title
  const trimmedTitle = title.trim().replace(/\s+/g, " ");
  // Checks if title is empty
  if (!trimmedTitle) {
    throw new ApiError({ status: 400, message: "Title is required" });
  }

  // Creating Playlist
  const playlist = await Playlist.create({
    title: trimmedTitle,
    description: description || "",
    owner: req.user._id
  });

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Playlist created successfully",
      data: playlist
    })
  );
};

const getUserPlaylists = async (req, res) => {
  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: mongoose.isValidObjectId(req.user._id)
          ? new mongoose.Types.ObjectId(req.user._id)
          : null
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Playlists fetched successfully",
      data: playlists
    })
  );
};

const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { title, description } = req.body;
  // Remove extra spaces from title
  const trimmedTitle = title.trim().replace(/\s+/g, " ");
  // Checks if title is empty
  if (!trimmedTitle) {
    throw new ApiError({ status: 400, message: "Title is required" });
  }

  // Initialize new details (recieved from user)
  const newDetails = {
    title: trimmedTitle
  };

  // If user wants to change description
  if (description !== undefined) {
    newDetails.description = description;
  }

  // Update Playlist title and description
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id
    },
    {
      ...newDetails
    },
    { new: true, runValidators: true }
  );

  if (!playlist) {
    throw new ApiError({
      status: 400,
      message: "User is not authorized or playlist does not exists"
    });
  }

  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Playlist details updated successfully",
      data: playlist
    })
  );
};

const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;

  const deleted = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id
  });

  if (!deleted) {
    throw new ApiError({
      status: 400,
      message: "User is not authorized or playlist does not exists"
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse({ status: 200, message: "Playlist deleted successfully" })
    );
};

const addVideoToPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.query;

  // Add video to playlist
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
      videos: { $ne: videoId }
    },
    {
      $addToSet: {
        videos: videoId
      }
    },
    {
      new: true
    }
  );

  // If video already exists in playlist
  if (!playlist) {
    throw new ApiError({
      status: 400,
      message: "Video already exists in playlist"
    });
  }

  // Final Response
  return res.status(200).json(
    new ApiResponse({
      status: 200,
      message: "Video added to playlist successfully",
      data: playlist
    })
  );
};

const removeVideoFromPlaylist = async (req, res) => {
  const { playlistId, videoId } = req.query;
  // Remove video from playlist
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id
    },
    {
      $pull: { videos: videoId }
    },
    {
      new: true
    }
  );

  // Checks if video already removed from playlist
  if (!playlist) {
    throw new ApiError({
      status: 400,
      message: "Video does not exist in playlist"
    });
  }

  // Final Response
  return res.status(200).json( new ApiResponse({
    status: 200,
    message: "Video removed from playlist successfully",
    data: playlist
  }));
};

export {
  createPlaylist,
  getUserPlaylists,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
};
