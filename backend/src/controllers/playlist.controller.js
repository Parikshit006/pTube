import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

     if (!name || name.trim() === "") {
       throw new ApiError(400, "Playlist name is required");
     }

     if (!description || description.trim() === "") {
       throw new ApiError(400, "Playlist description is required");
     }

     const playlist = await Playlist.create({
       name,
       description,
       owner: req.user._id,
       videos: [],
     });

     return res
       .status(201)
       .json(new ApiResponse(201, playlist, "Playlist created successfully"));

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params;

     if (!isValidObjectId(userId)) {
       throw new ApiError(400, "Invalid user ID");
     }

     const playlists = await Playlist.aggregate([
       {
         $match: {
           owner: new mongoose.Types.ObjectId(userId),
         },
       },
       {
         $lookup: {
           from: "videos",
           localField: "videos",
           foreignField: "_id",
           as: "videos",
         },
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
                 avatar: 1,
               },
             },
           ],
         },
       },
       {
         $addFields: {
           owner: { $first: "$owner" },
         },
       },
     ]);

     return res
       .status(200)
       .json(
         new ApiResponse(200, playlists, "User playlists fetched successfully")
       );
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

     if (!isValidObjectId(userId)) {
       throw new ApiError(400, "Invalid user ID");
     }

     const playlists = await Playlist.aggregate([
       {
         $match: {
           owner: new mongoose.Types.ObjectId(userId),
         },
       },
       {
         $lookup: {
           from: "videos",
           localField: "videos",
           foreignField: "_id",
           as: "videos",
         },
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
                 avatar: 1,
               },
             },
           ],
         },
       },
       {
         $addFields: {
           owner: { $first: "$owner" },
         },
       },
     ]);

     return res
       .status(200)
       .json(
         new ApiResponse(200, playlists, "User playlists fetched successfully")
       );
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videos",
          pipeline: [
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
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: { $first: "$owner" },
              },
            },
          ],
        },
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
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
    ]);

    if (!playlist.length) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    if (playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video already exists in playlist");
    }

    playlist.videos.push(videoId);

    await playlist.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;


    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await playlist.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;


    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this playlist");
    }

    await playlist.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
