import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

     if (!isValidObjectId(channelId)) {
       throw new ApiError(400, "Invalid channel ID");
     }

     const existingSubscription = await Subscription.findOne({
       subscriber: req.user._id,
       channel: channelId,
     });

     if (existingSubscription) {
       await existingSubscription.deleteOne();

       return res
         .status(200)
         .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
     }

     const subscription = await Subscription.create({
       subscriber: req.user._id,
       channel: channelId,
     });

     return res
       .status(201)
       .json(new ApiResponse(201, subscription, "Subscribed successfully"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

     if (!isValidObjectId(channelId)) {
       throw new ApiError(400, "Invalid channel ID");
     }

     const existingSubscription = await Subscription.findOne({
       subscriber: req.user._id,
       channel: channelId,
     });

     if (existingSubscription) {
       await existingSubscription.deleteOne();

       return res
         .status(200)
         .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
     }

     const subscription = await Subscription.create({
       subscriber: req.user._id,
       channel: channelId,
     });

     return res
       .status(201)
       .json(new ApiResponse(201, subscription, "Subscribed successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

        if (!isValidObjectId(subscriberId)) {
          throw new ApiError(400, "Invalid subscriber ID");
        }

        const subscribedChannels = await Subscription.aggregate([
          {
            $match: {
              subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
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
              channel: { $first: "$channel" },
            },
          },
        ]);

        return res.status(200).json(
          new ApiResponse(
            200,
            {
              totalSubscribedChannels: subscribedChannels.length,
              subscribedChannels,
            },
            "Subscribed channels fetched successfully"
          )
        );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}