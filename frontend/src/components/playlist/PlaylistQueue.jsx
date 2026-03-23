import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import VideoListItem from '../video/VideoListItem';

const PlaylistQueue = ({ videos = [], currentPlayingId, isOwner, onRemove }) => {
  if (videos.length === 0) {
    return <div className="p-4 text-center text-text-muted font-body">Playlist is empty.</div>;
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-3xl">
      {videos.map((video, index) => {
        const isActive = currentPlayingId === video._id;
        
        return (
          <div key={video._id} className="relative group/queue flex items-center pr-2 w-full">
            {isOwner && (
              <div className="p-2 cursor-grab text-text-muted hover:text-text-primary opacity-0 group-hover/queue:opacity-100 shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0 pointer-events-auto">
              {/* wrap inside flex to show drag handle before video item */}
              <VideoListItem video={video} index={index + 1} isActive={isActive} />
            </div>
            {isOwner && (
              <button 
                onClick={(e) => { e.preventDefault(); onRemove(video._id); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-bg-elevated border border-border-default rounded-full text-text-muted hover:text-red hover:border-red/20 opacity-0 group-hover/queue:opacity-100 transition-all z-10 btn-icon"
                title="Remove from playlist"
              >
                <Trash2 className="w-[15px] h-[15px]" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistQueue;
