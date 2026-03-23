import React from 'react';
import { useGetLikedVideosQuery } from '../api/likeApi';
import VideoGrid from '../components/video/VideoGrid';

const Liked = () => {
  const { data, isLoading, isFetching } = useGetLikedVideosQuery();
  
  // Backend returns array of video objects directly (already mapped in getLikedVideos)
  const videos = data?.data || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="border-b border-border-default pb-4 mb-6 pt-2">
        <h1 className="font-display font-semibold text-[24px] text-text-primary">Liked Videos</h1>
        <p className="font-body text-[14px] text-text-muted mt-1">Videos you've shown love to.</p>
      </div>

      {(!isLoading && videos.length === 0) ? (
        <div className="text-center p-8 bg-bg-secondary border border-border-default rounded-xl font-body text-text-muted max-w-md mx-auto mt-10">
          You haven't liked any videos yet. When you do, they will show up here.
        </div>
      ) : (
        <VideoGrid videos={videos} isLoading={isLoading || isFetching} />
      )}
    </div>
  );
};

export default Liked;