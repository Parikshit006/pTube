import React, { useState, useEffect } from 'react';
import VideoGrid from '../components/video/VideoGrid';
import { useGetAllVideosQuery } from '../api/videoApi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import InfiniteScrollSentinel from '../components/ui/InfiniteScrollSentinel';

const Trending = () => {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  
  const sortBy = 'views';
  
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

  const { onIntersect } = useInfiniteScroll(
    () => setPage(p => p + 1), 
    hasNextPage, 
    isFetching
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col mb-6 pt-2 pb-4 border-b border-border-default">
        <h1 className="font-display font-semibold text-[24px] text-text-primary leading-tight">Trending videos</h1>
        <p className="font-body text-[14px] text-text-muted mt-1">Discover what's hot right now on pTube.</p>
      </div>

      <div className="w-full">
        {(!isLoading && videos.length === 0) ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center gap-4">
            <svg className="w-24 h-24 text-border-strong opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            <h2 className="font-display font-semibold text-[18px] text-text-primary mt-4">No trending videos</h2>
            <p className="font-body text-[14px] text-text-muted">Check back later for trending content.</p>
          </div>
        ) : (
          <VideoGrid videos={videos} isLoading={isFetching} />
        )}

        <InfiniteScrollSentinel hasMore={hasNextPage} onIntersect={onIntersect} />
      </div>
    </div>
  );
};

export default Trending;
