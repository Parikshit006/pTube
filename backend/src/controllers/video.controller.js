import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  const matchStage = {};

  // Manual auth check for private videos
  let authUserId = null;
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      authUserId = decoded._id;
    } catch(err) {}
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
    // If not looking at our own videos, only show published ones
    if (!authUserId || authUserId.toString() !== userId.toString()) {
      matchStage.isPublished = true;
    }
  } else {
    matchStage.isPublished = true;
  }

  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ];
  }

  const sortStage = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  const aggregate = Video.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          { $project: { fullName: 1, username: 1, avatar: 1 } }
        ]
      }
    },
    { $addFields: { owner: { $first: "$owner" } } },
    { $sort: sortStage }
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(aggregate, options);

  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) throw new ApiError(400, "Video file is required");
  if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required");

  const videoUpload = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUpload?.url) {
    throw new ApiError(500, "Error uploading video");
  }

  const isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;

  const video = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    duration: videoUpload.duration,
    owner: req.user._id,
    isPublished
  });

  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  // Check if req user from token (optional)
  let userId = null;
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = decoded._id;
    } catch(err) {}
  }

  if (!video.isPublished && (!userId || video.owner.toString() !== userId.toString())) {
    throw new ApiError(403, "This video is not published");
  }

  video.views += 1;
  await video.save({ validateBeforeSave: false });

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { watchHistory: video._id }
    });
  } else {
      // Prompt literally said "owner's watch history", which might refer to adding it to the video owner's history just as a logging mechanism?
      // "Add video to owner's watch history." 
      // I'll add the logged in user as the owner of history, but to be extremely safe against weird literal interpretations, I will also add it to video.owner's watch history if there's no active user session. 
      // ACTUALLY the instructor from Chai Aur Code specifically writes `await User.findByIdAndUpdate(req.user._id, ...)` so "owner's watch history" means "the user who is executing".
  }

  const videoAggr = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
            }
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: {
                $cond: {
                  if: { $in: [userId ? new mongoose.Types.ObjectId(userId) : null, "$subscribers.subscriber"] },
                  then: true,
                  else: false
                }
              }
            }
          },
          { $project: { fullName: 1, username: 1, avatar: 1, subscribersCount: 1, isSubscribed: 1 } }
        ]
      }
    },
    { $addFields: { owner: { $first: "$owner" } } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments"
      }
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
        isLiked: {
          $cond: {
            if: { $in: [userId ? new mongoose.Types.ObjectId(userId) : null, "$likes.likedBy"] },
            then: true,
            else: false
          }
        }
      }
    },
    { $project: { likes: 0, comments: 0 } }
  ]);

  return res.status(200).json(new ApiResponse(200, videoAggr[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  if (title) video.title = title;
  if (description) video.description = description;

  const thumbnailLocalPath = req.file?.path;
  if (thumbnailLocalPath) {
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnailUpload?.url) throw new ApiError(500, "Thumbnail upload failed");
    // TODO: delete old thumbnail from cloudinary
    video.thumbnail = thumbnailUpload.url;
  }

  await video.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // Delete from cloudinary could be done here
  
  // Remove video from all playlists
  await Playlist.updateMany(
    { videos: videoId },
    { $pull: { videos: videoId } }
  );

  // Delete all comments
  await Comment.deleteMany({ video: videoId });

  // Delete all likes
  await Like.deleteMany({ video: videoId });

  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this video");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, video, "Publish status updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
