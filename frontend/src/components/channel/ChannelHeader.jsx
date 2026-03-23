import React from 'react';
import Avatar from '../ui/Avatar';
import SubscribeButton from './SubscribeButton';
import { MoreVertical } from 'lucide-react';
import { formatCount } from '../../utils/formatters';
import Skeleton from '../ui/Skeleton';

const ChannelHeader = ({ profile, isLoading, isOwner, onEditClick }) => {
  if (isLoading) {
    return (
      <div className="flex justify-between items-start pb-6">
        <div className="flex gap-4 sm:gap-6 items-center">
          <Skeleton className="w-[80px] h-[80px] sm:w-[128px] sm:h-[128px] rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full mt-4 sm:mt-0">
            <Skeleton className="w-48 h-6 sm:h-8" />
            <Skeleton className="w-32 h-4 sm:h-5 mt-1" />
            <Skeleton className="w-56 h-3 sm:h-4 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6">
      <div className="flex gap-4 sm:gap-6 items-center flex-1 min-w-0 pointer-events-none">
        <Avatar 
          src={profile?.avatar} 
          name={profile?.username} 
          size="xl" 
          className="w-[80px] h-[80px] sm:w-[128px] sm:h-[128px] ring-4 ring-bg-primary mt-[-40px] sm:mt-0 pointer-events-auto shrink-0 bg-bg-primary" 
        />
        <div className="flex flex-col flex-1 min-w-0 -mt-2 sm:mt-0 pointer-events-auto pr-4">
          <h1 className="font-display font-bold text-[22px] sm:text-[32px] text-text-primary leading-tight truncate">
            {profile?.fullName || profile?.username}
          </h1>
          <div className="flex items-center gap-2 mt-1 sm:mt-2 opacity-80 flex-wrap">
            <span className="font-mono text-[13px] sm:text-[14px] text-text-muted">
              @{profile?.username}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-border-strong hidden xs:block" />
            <span className="font-mono text-[12px] sm:text-[13px] text-text-muted">
              {formatCount(profile?.subscribersCount || 0)} subscribers
            </span>
            <span className="w-1 h-1 rounded-full bg-border-strong" />
            <span className="font-mono text-[12px] sm:text-[13px] text-text-muted">
              {formatCount(profile?.videosCount || 0)} videos
            </span>
          </div>
          
          <p className="font-body text-[14px] text-text-secondary mt-3 sm:mt-4 line-clamp-1 max-w-2xl text-left">
            {profile?.description || 'No description provided.'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end w-full sm:w-auto">
        {isOwner ? (
          <button 
            onClick={onEditClick}
            className="rounded-full bg-bg-secondary hover:bg-bg-tertiary border border-border-default px-6 h-10 font-body font-medium text-[14px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red whitespace-nowrap outline-none"
          >
            Customize profile
          </button>
        ) : (
          <SubscribeButton 
            channelId={profile?._id} 
            initialSubscribed={profile?.isSubscribed} 
          />
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
