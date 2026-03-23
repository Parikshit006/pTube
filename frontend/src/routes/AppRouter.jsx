import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Watch from '../pages/Watch';
import Trending from '../pages/Trending';
import Tweets from '../pages/Tweets';
import Channel from '../pages/Channel';
import Playlist from '../pages/Playlist';
import Playlists from '../pages/Playlists';
import Upload from '../pages/Upload';
import Dashboard from '../pages/Dashboard';
import Search from '../pages/Search';
import Subscriptions from '../pages/Subscriptions';
import History from '../pages/History';
import Liked from '../pages/Liked';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'watch/:videoId', element: <Watch /> },
      { path: 'trending', element: <Trending /> },
      { path: 'tweets', element: <Tweets /> },
      { path: 'channel/:username', element: <Channel /> },
      { path: 'playlist/:playlistId', element: <Playlist /> },
      { path: 'playlists', element: <Playlists /> },
      { path: 'search', element: <Search /> },
      { path: 'subscriptions', element: <Subscriptions /> },
      { path: 'history', element: <History /> },
      { path: 'liked', element: <Liked /> },
      {
        path: 'upload',
        element: (
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>
  },
  {
    path: '/register',
    element: <AuthLayout><Register /></AuthLayout>
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default AppRouter;
