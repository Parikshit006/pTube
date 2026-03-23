import React, { useState, useEffect } from 'react';
import TweetComposer from '../components/tweet/TweetComposer';
import TweetFeed from '../components/tweet/TweetFeed';
import { useSelector } from 'react-redux';
import { useGetUserTweetsQuery } from '../api/tweetApi';

const Tweets = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Using user's own ID if authenticated or skipping until we have a real general feed API
  // Let's assume the API serves tweets. I'll mock global by passing a mock ID or bypassing
  // For now, I'll fetch user's tweets if logged in, otherwise just an empty state.
  // Real implementation would use an `/api/v1/tweets` feed endpoint.
  // I will just use `useGetUserTweetsQuery` for now with user ID, if not authenticated -> no tweets.
  const { data, isLoading } = useGetUserTweetsQuery(user?._id, { skip: !user?._id });

  const tweets = data?.data || [];

  return (
    <div className="flex justify-center w-full min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-[600px] flex flex-col gap-2">
        <h1 className="font-display font-semibold text-[20px] mb-4 text-text-primary px-2">Tweets</h1>
        
        {isAuthenticated && (
          <TweetComposer user={user} />
        )}

        <TweetFeed 
          tweets={tweets} 
          isFetching={isLoading} 
          hasNextPage={false} // since it's a simple query returning all right now
          fetchNextPage={() => {}}
        />

        {!isAuthenticated && tweets.length === 0 && !isLoading && (
           <div className="p-8 text-center bg-bg-secondary rounded-xl font-body text-[14px] text-text-muted mt-4">
             Sign in to see tweets from your subscriptions and post your own.
           </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;