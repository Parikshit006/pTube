import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const t = localStorage.getItem('ptube-theme');
  const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return t === 'dark' || (t === null && d) ? 'dark' : 'light';
};

const initialState = {
  sidebarOpen: false,
  theme: getInitialTheme(),
  searchQuery: '',
  uploadProgress: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('ptube-theme', state.theme);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleTheme, setSearchQuery, setUploadProgress } = uiSlice.actions;
export default uiSlice.reducer;
