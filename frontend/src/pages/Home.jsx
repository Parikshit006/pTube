import React, { useState, useEffect } from 'react';
import VideoGrid from '../components/video/VideoGrid';
import { useGetAllVideosQuery } from '../api/videoApi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import InfiniteScrollSentinel from '../components/ui/InfiniteScrollSentinel';

const Home = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  
  const sortBy = activeTab === 'Trending' ? 'views' : 'createdAt';
  
  const { data, isFetching, isLoading } = useGetAllVideosQuery({ 
    page, 
    limit: 20, 
    sortBy, 
    sortType: 'desc' 
  });

  const rawVideos = data?.data?.docs || [];
  const hasNextPage = data?.data?.hasNextPage || false;

  useEffect(() => {
    if (page === 1) {
      setVideos(rawVideos);
    } else {
      setVideos(prev => {
        const newIds = new Set(rawVideos.map(v => v._id));
        const filteredPrev = prev.filter(v => !newIds.has(v._id));
        return [...filteredPrev, ...rawVideos];
      });
    }
  }, [rawVideos]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const { onIntersect } = useInfiniteScroll(
    () => setPage(p => p + 1), 
    hasNextPage, 
    isFetching
  );

  const tabs = ['All', 'Subscriptions', 'Trending'];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-[56px] z-20 bg-bg-primary border-b border-border-subtle py-3 flex gap-3 overflow-x-auto cs-scroll px-1 -mx-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full font-body text-[14px] font-medium transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-red ${
              activeTab === tab 
                ? 'bg-text-primary text-bg-primary' 
                : 'bg-bg-tertiary text-text-muted hover:bg-border-default hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-6 w-full">
        {(!isLoading && videos.length === 0) ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center gap-4">
            <svg className="w-24 h-24 text-border-strong opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            <h2 className="font-display font-semibold text-[18px] text-text-primary mt-4">No videos yet</h2>
            <p className="font-body text-[14px] text-text-muted">We couldn't find any videos for this category.</p>
          </div>
        ) : (
          <VideoGrid videos={videos} isLoading={isFetching} />
        )}

        <InfiniteScrollSentinel hasMore={hasNextPage} onIntersect={onIntersect} />
      </div>
    </div>
  );
};

export default Home;