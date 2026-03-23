import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { formatDuration, formatViews, formatDate } from '../../utils/formatters';

const VideoCard = ({ video }) => {
  return (
    <div className="flex flex-col gap-3 group">
      <Link to={`/watch/${video._id}`} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[11px] px-2 py-0.5 rounded-[4px] tracking-wide">
          {formatDuration(video.duration)}
        </div>
      </Link>
      <div className="flex gap-3 pr-4">
        <Link to={`/channel/${video.owner?.username}`} className="shrink-0 mt-1">
          <Avatar 
            src={video.owner?.avatar} 
            name={video.owner?.username} 
            size="md" 
            className="w-9 h-9" 
          />
        </Link>
        <div className="flex flex-col">
          <Link to={`/watch/${video._id}`} className="font-body font-medium text-[14px] text-text-primary line-clamp-2 leading-snug group-hover:text-red transition-colors">
            {video.title}
          </Link>
          <div className="text-[13px] text-text-muted mt-1 flex flex-col font-body">
            <Link to={`/channel/${video.owner?.username}`} className="hover:text-text-primary transition-colors inline-block w-fit">
              {video.owner?.fullName || video.owner?.username}
            </Link>
            <div className="font-mono text-[11px] mt-0.5 flex items-center gap-1.5 opacity-80">
              <span>{formatViews(video.views)} views</span>
              <span className="w-1 h-1 rounded-full bg-text-disabled" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
