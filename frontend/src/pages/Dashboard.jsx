import React, { useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ViewsChart from '../components/dashboard/ViewsChart';
import VideoStatsTable from '../components/dashboard/VideoStatsTable';
import { Eye, Users, Heart, Video } from 'lucide-react';
import { useGetChannelStatsQuery, useGetChannelVideosQuery } from '../api/dashboardApi';
import { useDeleteVideoMutation, useTogglePublishStatusMutation } from '../api/videoApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { data: statsData } = useGetChannelStatsQuery();
  const { data: videosData, isLoading: videosLoading } = useGetChannelVideosQuery();
  const [deleteVideo] = useDeleteVideoMutation();
  const [togglePublish] = useTogglePublishStatusMutation();

  const stats = statsData?.data || {
    totalViews: 0,
    totalSubscribers: 0,
    totalLikes: 0,
    totalVideos: 0,
  };
  const prevStats = { ...stats }; // Assume previous is same for now, or fetch historical

  const videos = videosData?.data || [];

  const handleEdit = (video) => {
    toast('Editing from dashboard coming soon', { icon: '🚧' });
  };

  const handleDelete = async (video) => {
    if (window.confirm('Delete this video from your channel? This cannot be undone.')) {
      try {
        await deleteVideo(video._id).unwrap();
        toast.success('Video deleted permanently');
      } catch {
        // Handled
      }
    }
  };

  const handleTogglePublish = async (video) => {
    try {
      await togglePublish(video._id).unwrap();
      toast.success(video.isPublished ? 'Video unpublished' : 'Video published');
    } catch {
      toast.error('Could not toggle visibility');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-default">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-text-primary leading-tight">Channel Analytics</h1>
          <p className="font-body text-[14px] text-text-muted mt-1">Get an overview of your channel's performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Total Views" value={stats.totalViews} previousValue={stats.totalViews - 120} icon={Eye} colorClass="text-gold" />
        <StatsCard title="Subscribers" value={stats.totalSubscribers} previousValue={stats.totalSubscribers - 15} icon={Users} colorClass="text-green" />
        <StatsCard title="Total Likes" value={stats.totalLikes} previousValue={stats.totalLikes - 40} icon={Heart} colorClass="text-red" />
        <StatsCard title="Videos" value={stats.totalVideos} previousValue={stats.totalVideos - 1} icon={Video} colorClass="text-blue" />
      </div>

      <div className="w-full min-w-0">
        <ViewsChart />
      </div>

      <div className="mt-8 mb-4">
        <h2 className="font-display font-semibold text-[20px] text-text-primary">Your Content</h2>
        <p className="font-body text-[14px] text-text-muted mt-1">Manage your uploaded videos.</p>
      </div>

      <VideoStatsTable 
        videos={videos} 
        isLoading={videosLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onTogglePublish={handleTogglePublish} 
      />
    </div>
  );
};

export default Dashboard;