import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
};

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const refreshRes = await axiosInstance.post('/users/refresh-token')
      const accessToken = refreshRes.data.data.accessToken
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      const userRes = await axiosInstance.get('/users/current-user')
      const user = userRes.data.data
      return { accessToken, user }
    } catch {
      return rejectWithValue(null)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      delete axiosInstance.defaults.headers.common['Authorization'];
      axiosInstance.post('/users/logout').catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, setAccessToken, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
