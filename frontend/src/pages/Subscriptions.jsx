import React, { useState } from 'react';
import { useGetSubscribedChannelsQuery } from '../api/subscriptionApi';
import { useSelector } from 'react-redux';
import Avatar from '../components/ui/Avatar';
import { Link } from 'react-router-dom';
import SubscribeButton from '../components/channel/SubscribeButton';
import Skeleton from '../components/ui/Skeleton';

const Subscriptions = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetSubscribedChannelsQuery(user?._id, { skip: !user?._id });

  const subscriptions = data?.data || [];

  return (
    <div className="flex flex-col w-full min-h-screen max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-border-default pb-4 mb-6 pt-2">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-text-primary">Subscriptions</h1>
          <p className="font-body text-[14px] text-text-muted mt-1">Channels you are following.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full cursor-default">
        {isLoading && [...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
             <Skeleton className="w-[80px] h-[80px] rounded-full shrink-0" />
             <div className="flex flex-col gap-2 flex-1">
               <Skeleton className="h-5 w-[200px]" />
               <Skeleton className="h-4 w-[120px]" />
             </div>
          </div>
        ))}

        {!isLoading && subscriptions.length === 0 && (
          <div className="text-center bg-bg-secondary rounded-xl p-8 border border-border-default font-body text-[14px] text-text-muted">
            You are not subscribed to any channels yet.
          </div>
        )}

        {subscriptions.map((sub) => {
          const channel = sub.channel || sub; // depending on backend population
          return (
            <div key={channel._id} className="flex items-center justify-between py-4 px-2 hover:bg-bg-secondary rounded-xl group transition-colors">
              <Link to={`/channel/${channel.username}`} className="flex items-center gap-6 flex-1 min-w-0">
                <Avatar src={channel.avatar} name={channel.username} size="xl" className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] ring-2 ring-transparent group-hover:ring-red transition-all" />
                <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
                  <h3 className="font-display font-bold text-[18px] text-text-primary truncate group-hover:text-red transition-colors">
                    {channel.fullName || channel.username}
                  </h3>
                  <p className="font-mono text-[13px] text-text-muted truncate">@{channel.username}</p>
                  <p className="font-body text-[13px] text-text-secondary mt-1 line-clamp-1 hidden sm:-webkit-box">
                    {channel.description || 'No description provided.'}
                  </p>
                </div>
              </Link>
              
              <div className="shrink-0 pl-2">
                <SubscribeButton channelId={channel._id} initialSubscribed={true} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscriptions;