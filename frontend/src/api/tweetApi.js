import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const tweetApi = createApi({
  reducerPath: 'tweetApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Tweet'],
  endpoints: (builder) => ({
    getUserTweets: builder.query({
      query: (userId) => ({
        url: `/tweets/user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Tweet'],
    }),
    createTweet: builder.mutation({
      query: (content) => ({
        url: '/tweets',
        method: 'POST',
        data: { content },
      }),
      invalidatesTags: ['Tweet'],
    }),
    updateTweet: builder.mutation({
      query: ({ id, content }) => ({
        url: `/tweets/${id}`,
        method: 'PATCH',
        data: { content },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tweet', id }, 'Tweet'],
    }),
    deleteTweet: builder.mutation({
      query: (id) => ({
        url: `/tweets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tweet'],
    }),
  }),
});

export const {
  useGetUserTweetsQuery,
  useCreateTweetMutation,
  useUpdateTweetMutation,
  useDeleteTweetMutation,
} = tweetApi;
