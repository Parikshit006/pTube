import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'ChannelProfile'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: '/users/register',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/users/refresh-token',
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: '/users/current-user',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getChannelProfile: builder.query({
      query: (username) => ({
        url: `/users/c/${username}`,
        method: 'GET',
      }),
      providesTags: ['ChannelProfile'],
    }),
    updateAccount: builder.mutation({
      query: (data) => ({
        url: '/users/update-account',
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['User', 'ChannelProfile'],
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/avatar',
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['User', 'ChannelProfile'],
    }),
    updateCoverImage: builder.mutation({
      query: (formData) => ({
        url: '/users/cover-image',
        method: 'PATCH',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['User', 'ChannelProfile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        data,
      }),
    }),
    getWatchHistory: builder.query({
      query: () => ({
        url: '/users/history',
        method: 'GET',
      }),
      providesTags: ['Video', 'User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useGetChannelProfileQuery,
  useUpdateAccountMutation,
  useUpdateAvatarMutation,
  useUpdateCoverImageMutation,
  useChangePasswordMutation,
  useGetWatchHistoryQuery,
} = userApi;
