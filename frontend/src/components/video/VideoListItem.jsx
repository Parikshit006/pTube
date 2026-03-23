import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration, formatViews, formatDate } from '../../utils/formatters';

const VideoListItem = ({ video, isActive = false, index }) => {
  return (
    <div className={`flex items-start gap-4 p-2 rounded-xl transition-colors hover:bg-bg-secondary group ${isActive ? 'bg-red-dim border-l-4 border-red' : ''}`}>
      {index !== undefined && (
        <span className="font-mono text-text-muted mt-5 hidden sm:block w-[24px] text-right shrink-0">
          {index}
        </span>
      )}
      
      <Link to={`/watch/${video._id}`} className="shrink-0 relative rounded-lg overflow-hidden cursor-pointer w-[120px] sm:w-[168px] aspect-video">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-[4px]">
          {formatDuration(video.duration)}
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 min-w-0 pr-2">
        <Link to={`/watch/${video._id}`} className="font-body font-medium text-[14px] sm:text-[15px] text-text-primary line-clamp-2 leading-snug group-hover:text-red transition-colors mb-1">
          {video.title}
        </Link>
        <Link to={`/channel/${video.owner?.username}`} className="font-body text-[12px] sm:text-[13px] text-text-muted hover:text-text-primary transition-colors line-clamp-1 mb-0.5">
          {video.owner?.fullName || video.owner?.username}
        </Link>
        <div className="font-mono text-[11px] text-text-disabled flex items-center gap-1.5">
          <span>{formatViews(video.views)} views</span>
          <span className="w-1 h-1 rounded-full bg-border-strong" />
          <span>{formatDate(video.createdAt)}</span>
        </div>
        
        {/* Only show description on larger screens if desired, but limit to 1 line */}
        <p className="hidden md:block font-body text-[12px] text-text-disabled line-clamp-1 mt-2">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default VideoListItem;
