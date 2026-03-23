import React from 'react';
import Skeleton from '../ui/Skeleton';

const VideoSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-video rounded-xl" />
      <div className="flex gap-3 pr-4">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 w-full mt-1">
          <Skeleton className="h-4 w-[90%] rounded-sm" />
          <Skeleton className="h-4 w-[60%] rounded-sm" />
          <div className="flex gap-2 mt-1">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-20 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
