import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Subscription', 'ChannelProfile'],
  endpoints: (builder) => ({
    toggleSubscription: builder.mutation({
      query: (channelId) => ({
        url: `/subscriptions/c/${channelId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription', 'ChannelProfile'],
    }),
    // Get channels that a user is subscribed to — backend: GET /subscriptions/c/:channelId where channelId = the user's own ID
    getSubscribedChannels: builder.query({
      query: (userId) => ({
        url: `/subscriptions/c/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    // Get subscribers of a channel — backend: GET /subscriptions/u/:subscriberId
    getChannelSubscribers: builder.query({
      query: (channelId) => ({
        url: `/subscriptions/u/${channelId}`,
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
  }),
});

export const {
  useToggleSubscriptionMutation,
  useGetSubscribedChannelsQuery,
  useGetChannelSubscribersQuery,
} = subscriptionApi;
