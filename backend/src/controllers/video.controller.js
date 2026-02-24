import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;
  
  //TODO: get all videos based on query, sort, pagination
  const matchStage = {
    isPublished: true,
  };

  if (query) {
    matchStage.title = { $regex: query, $options: "i" };
  }

  const sortStage = {
    [sortBy]: sortType === "asc" ? 1 : -1,
  };

  const aggregate = Video.aggregate([
    {
      $match: matchStage,
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
              fullName: 1,
              username: 1,
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
    {
      $sort: sortStage,
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoUpload = await uploadOnCloudinary(videoLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUpload?.url) {
    throw new ApiError(500, "Error uploading video");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    duration: videoUpload.duration, // VERY IMPORTANT
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate(
      "owner",
      "fullName username avatar"
    );

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // If video is unpublished and user is not owner
    if (
      !video.isPublished &&
      video.owner._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, "This video is not published");
    }

    // Increment views
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  
  //TODO: update video details like title, description, thumbnail
   const { videoId } = req.params;
   const { title, description } = req.body;

   if (!isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid video ID");
   }

   const video = await Video.findById(videoId);

   if (!video) {
     throw new ApiError(404, "Video not found");
   }

   // Owner validation
   if (video.owner.toString() !== req.user._id.toString()) {
     throw new ApiError(403, "You are not authorized to update this video");
   }

   // Update fields if provided
   if (title) video.title = title;
   if (description) video.description = description;

   // If thumbnail uploaded
   const thumbnailLocalPath = req.file?.path;

   if (thumbnailLocalPath) {
     const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

     if (!thumbnailUpload?.url) {
       throw new ApiError(500, "Thumbnail upload failed");
     }

     video.thumbnail = thumbnailUpload.url;
   }

   await video.save({ validateBeforeSave: false });

   return res
     .status(200)
     .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  
  //TODO: delete video
   const { videoId } = req.params;

   if (!isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid video ID");
   }

   const video = await Video.findById(videoId);

   if (!video) {
     throw new ApiError(404, "Video not found");
   }

   if (video.owner.toString() !== req.user._id.toString()) {
     throw new ApiError(403, "You are not authorized to delete this video");
   }

   await video.deleteOne();

   return res
     .status(200)
     .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Only owner can toggle
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this video");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
