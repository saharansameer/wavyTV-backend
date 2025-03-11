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

export { createPlaylist, getUserPlaylists };
