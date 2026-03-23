import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import playerReducer from './playerSlice';
import { injectStore as injectAxiosStore } from '../utils/axiosInstance';

// API slices
import { videoApi } from '../api/videoApi';
import { userApi } from '../api/userApi';
import { tweetApi } from '../api/tweetApi';
import { likeApi } from '../api/likeApi';
import { commentApi } from '../api/commentApi';
import { subscriptionApi } from '../api/subscriptionApi';
import { playlistApi } from '../api/playlistApi';
import { dashboardApi } from '../api/dashboardApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    player: playerReducer,
    [videoApi.reducerPath]: videoApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [tweetApi.reducerPath]: tweetApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      videoApi.middleware,
      userApi.middleware,
      tweetApi.middleware,
      likeApi.middleware,
      commentApi.middleware,
      subscriptionApi.middleware,
      playlistApi.middleware,
      dashboardApi.middleware
    ),
});

// Inject store into axios to avoid circular imports
injectAxiosStore(store);
