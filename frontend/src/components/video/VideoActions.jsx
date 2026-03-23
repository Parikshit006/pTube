import React from 'react';
import { ThumbsUp, ThumbsDown, Share, BookmarkPlus, MoreHorizontal } from 'lucide-react';
import { useLikeToggle } from '../../hooks/useLikeToggle';
import { formatCount } from '../../utils/formatters';

const VideoActions = ({ videoId, initialLikes, isLiked, onSave }) => {
  const { isLiked: currentlyLiked, likeCount, toggleLike } = useLikeToggle('video', videoId, initialLikes, isLiked);

  return (
    <div className="flex items-center gap-2 overflow-x-auto cs-scroll pb-1">
      <div className="flex bg-bg-secondary rounded-full border border-border-default overflow-hidden shrink-0">
        <button 
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 hover:bg-bg-tertiary transition-colors font-body font-medium text-[13px] border-r border-border-default outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red ${currentlyLiked ? 'text-red' : 'text-text-primary'}`}
        >
          <ThumbsUp className={`w-[18px] h-[18px] ${currentlyLiked ? 'fill-current' : ''}`} />
          <span>{formatCount(likeCount)}</span>
        </button>
        <button className="flex items-center justify-center px-4 py-2 hover:bg-bg-tertiary transition-colors text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red">
          <ThumbsDown className="w-[18px] h-[18px]" />
        </button>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border-default hover:bg-bg-tertiary transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red">
        <Share className="w-[18px] h-[18px] text-text-primary" />
        <span className="font-body font-medium text-[13px] text-text-primary">Share</span>
      </button>

      <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-full border border-border-default hover:bg-bg-tertiary transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red">
        <BookmarkPlus className="w-[18px] h-[18px] text-text-primary" />
        <span className="font-body font-medium text-[13px] text-text-primary hidden sm:inline">Save</span>
      </button>

      <button className="btn-icon w-9 h-9 bg-bg-secondary border border-border-default hover:bg-bg-tertiary shrink-0">
        <MoreHorizontal className="w-[18px] h-[18px] text-text-primary" />
      </button>
    </div>
  );
};

export default VideoActions;
