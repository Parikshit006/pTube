import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
     if (!mongoose.isValidObjectId(videoId)) {
       throw new ApiError(400, "Invalid video ID");
     }

     const aggregate = Comment.aggregate([
       {
         $match: {
           video: new mongoose.Types.ObjectId(videoId),
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
         $sort: { createdAt: -1 },
       },
     ]);

     const options = {
       page: parseInt(page),
       limit: parseInt(limit),
     };

     const comments = await Comment.aggregatePaginate(aggregate, options);

     return res
       .status(200)
       .json(
         new ApiResponse(200, comments, "Video comments fetched successfully")
       );

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
     const { videoId } = req.params;
     const { content } = req.body;

     if (!mongoose.isValidObjectId(videoId)) {
       throw new ApiError(400, "Invalid video ID");
     }

     if (!content || content.trim() === "") {
       throw new ApiError(400, "Comment content is required");
     }

     const comment = await Comment.create({
       content,
       video: videoId,
       owner: req.user._id,
     });

     return res
       .status(201)
       .json(new ApiResponse(201, comment, "Comment added successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
      const { commentId } = req.params;
      const { content } = req.body;

      if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
      }

      if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new ApiError(404, "Comment not found");
      }

      if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
          403,
          "You are not authorized to update this comment"
        );
      }

      comment.content = content;
      await comment.save({ validateBeforeSave: false });

      return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
     const { commentId } = req.params;

     if (!mongoose.isValidObjectId(commentId)) {
       throw new ApiError(400, "Invalid comment ID");
     }

     const comment = await Comment.findById(commentId);

     if (!comment) {
       throw new ApiError(404, "Comment not found");
     }

     if (comment.owner.toString() !== req.user._id.toString()) {
       throw new ApiError(403, "You are not authorized to delete this comment");
     }

     await comment.deleteOne();

     return res
       .status(200)
       .json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
