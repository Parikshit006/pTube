import React from 'react';
import VideoCard from './VideoCard';
import VideoSkeleton from './VideoSkeleton';

const VideoGrid = ({ videos, isLoading, skeletonsCount = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
      {videos?.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
      
      {isLoading && 
        Array.from({ length: skeletonsCount }).map((_, i) => (
          <VideoSkeleton key={`skeleton-${i}`} />
        ))
      }
    </div>
  );
};

export default VideoGrid;
