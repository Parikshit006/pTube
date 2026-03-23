import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getAllVideos: builder.query({
      query: (params) => ({
        url: '/videos',
        method: 'GET',
        params,
      }),
      providesTags: ['Video'],
    }),
    getVideoById: builder.query({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Video', id }],
    }),
    publishVideo: builder.mutation({
      query: (formData) => ({
        url: '/videos',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['Video'],
    }),
    updateVideo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/videos/${id}`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Video', id }, 'Video'],
    }),
    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Video'],
    }),
    togglePublishStatus: builder.mutation({
      query: (id) => ({
        url: `/videos/toggle/publish/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Video', id }, 'Video'],
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  usePublishVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useTogglePublishStatusMutation,
} = videoApi;
