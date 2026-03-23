import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getVideoComments: builder.query({
      query: ({ videoId, page = 1, limit = 10 }) => ({
        url: `/comments/${videoId}`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result, error, { videoId }) => [{ type: 'Comment', id: `List-${videoId}` }],
    }),
    addComment: builder.mutation({
      query: ({ videoId, content }) => ({
        url: `/comments/${videoId}`,
        method: 'POST',
        data: { content },
      }),
      invalidatesTags: (result, error, { videoId }) => [{ type: 'Comment', id: `List-${videoId}` }],
    }),
    updateComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/comments/c/${id}`,
        method: 'PATCH',
        data: { content },
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/c/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetVideoCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
