import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVideo: null,
  isPlaying: false,
  volume: 1,
  watchHistory: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    addToHistory: (state, action) => {
      state.watchHistory.push(action.payload);
    },
  },
});

export const { setCurrentVideo, setIsPlaying, setVolume, addToHistory } = playerSlice.actions;
export default playerSlice.reducer;
