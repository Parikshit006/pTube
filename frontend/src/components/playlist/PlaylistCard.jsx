import React from 'react';
import { Link } from 'react-router-dom';
import { ListVideo } from 'lucide-react';
import { formatCount } from '../../utils/formatters';

const PlaylistCard = ({ playlist }) => {
  const thumbnail = playlist.videos?.[0]?.thumbnail || 'https://via.placeholder.com/640x360.png?text=No+Videos';
  const videoCount = playlist.videos?.length || 0;

  return (
    <div className="flex flex-col gap-2 group cursor-pointer w-full max-w-[320px]">
      <div className="relative aspect-video rounded-xl overflow-hidden mt-2">
        {/* Mock Stacked effect */}
        <div className="absolute top-[-8px] right-2 left-2 h-4 bg-bg-tertiary rounded-t-xl opacity-60 transition-transform group-hover:translate-y-[-4px]" />
        <div className="absolute top-[-4px] right-1 left-1 h-2 bg-text-disabled rounded-t-xl opacity-40 transition-transform group-hover:translate-y-[-2px]" />
        
        <img src={thumbnail} alt={playlist.name} className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105" />
        
        <div className="absolute bottom-0 right-0 left-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end justify-between p-2">
          <span className="font-mono text-[11px] text-white/90 bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
            <ListVideo className="w-3 h-3" />
            {videoCount} {videoCount === 1 ? 'video' : 'videos'}
          </span>
        </div>
      </div>

      <div className="flex flex-col mt-2 px-1">
        <h3 className="font-display font-semibold text-[15px] text-text-primary group-hover:text-purple transition-colors line-clamp-2 leading-tight">
          {playlist.name}
        </h3>
        {playlist.owner && (
          <span className="font-body text-[13px] text-text-muted mt-0.5 flex items-center">
            {playlist.owner.fullName || playlist.owner.username}
          </span>
        )}
        <div className="font-mono text-[11px] text-text-disabled mt-1 pb-1">
          {playlist.description || "No description"}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
