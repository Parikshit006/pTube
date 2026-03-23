import React from 'react';
import TweetCard from './TweetCard';
import Skeleton from '../ui/Skeleton';
import InfiniteScrollSentinel from '../ui/InfiniteScrollSentinel';

const TweetFeed = ({ tweets, isFetching, hasNextPage, fetchNextPage }) => {
  return (
    <div className="flex flex-col border border-border-default rounded-[12px] overflow-hidden bg-bg-primary">
      {tweets?.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
      
      {isFetching && (
        <div className="flex flex-col p-4 border-b border-border-default gap-3">
          <div className="flex gap-4">
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 w-full mt-1">
              <Skeleton className="w-[40%] h-4" />
              <Skeleton className="w-[90%] h-4 mt-1" />
              <Skeleton className="w-[60%] h-4" />
            </div>
          </div>
        </div>
      )}

      {!isFetching && tweets?.length === 0 && (
        <div className="p-8 text-center text-text-muted font-body">
          No tweets to display.
        </div>
      )}

      {/* Infinite Scroll trigger */}
      {hasNextPage && (
        <InfiniteScrollSentinel hasMore={hasNextPage} onIntersect={fetchNextPage} />
      )}
    </div>
  );
};

export default TweetFeed;
