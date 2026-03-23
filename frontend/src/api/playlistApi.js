import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    createPlaylist: builder.mutation({
      query: ({ name, description }) => ({
        url: '/playlists',
        method: 'POST',
        data: { name, description },  // plain JSON, not FormData
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Playlist'],
    }),
    getPlaylistById: builder.query({
      query: (id) => ({
        url: `/playlists/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Playlist', id }],
    }),
    getUserPlaylists: builder.query({
      query: (userId) => ({
        url: `/playlists/user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['Playlist'],
    }),
    updatePlaylist: builder.mutation({
      query: ({ id, data }) => ({
        url: `/playlists/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    deletePlaylist: builder.mutation({
      query: (id) => ({
        url: `/playlists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlist'],
    }),
    addVideoToPlaylist: builder.mutation({
      query: ({ videoId, playlistId }) => ({
        url: `/playlists/add/${videoId}/${playlistId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
    removeVideoFromPlaylist: builder.mutation({
      query: ({ videoId, playlistId }) => ({
        url: `/playlists/remove/${videoId}/${playlistId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
  }),
});

export const {
  useCreatePlaylistMutation,
  useGetPlaylistByIdQuery,
  useGetUserPlaylistsQuery,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
} = playlistApi;
