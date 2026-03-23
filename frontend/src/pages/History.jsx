import React from 'react';
import { useGetWatchHistoryQuery } from '../api/userApi';
import VideoGrid from '../components/video/VideoGrid';
import { useSelector } from 'react-redux';

const History = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading, isFetching } = useGetWatchHistoryQuery(undefined, { skip: !user });

  const videos = data?.data || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="border-b border-border-default pb-4 mb-6 pt-2">
        <h1 className="font-display font-semibold text-[24px]">Watch History</h1>
        <p className="font-body text-[14px] text-text-muted mt-1">Videos you have watched recently.</p>
      </div>

      {(!isLoading && videos.length === 0) ? (
        <div className="text-center p-8 bg-bg-secondary border border-border-default rounded-xl font-body text-text-muted max-w-md mx-auto mt-10">
          Your watch history is empty. Start watching videos!
        </div>
      ) : (
        <VideoGrid videos={videos} isLoading={isLoading || isFetching} />
      )}
    </div>
  );
};

export default History;