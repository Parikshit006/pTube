import React, { useState } from 'react';
import { formatViews, formatDate } from '../../utils/formatters';

const VideoInfo = ({ title, views, createdAt, description, tags = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col mt-4">
      <h1 className="font-display font-bold text-[20px] text-text-primary leading-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-2 mt-2 font-mono text-[12px] text-text-muted">
        <span>{formatViews(views)} views</span>
        <span className="w-1 h-1 rounded-full bg-border-strong" />
        <span>{formatDate(createdAt)}</span>
      </div>

      <div className="mt-4 bg-bg-secondary hover:bg-bg-tertiary transition-colors rounded-xl p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="font-body text-[13px] text-blue hover:underline">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
        <div className={`font-body text-[14px] text-text-secondary whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>
          {description || "No description provided."}
        </div>
        {!isExpanded && (
          <button className="text-[14px] font-body font-medium text-text-primary mt-2">
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;
