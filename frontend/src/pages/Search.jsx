import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllVideosQuery } from '../api/videoApi';
import VideoListItem from '../components/video/VideoListItem';
import Skeleton from '../components/ui/Skeleton';
import InfiniteScrollSentinel from '../components/ui/InfiniteScrollSentinel';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortBy, setSortBy] = useState('relevance');
  const [duration, setDuration] = useState('any');
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);

  // Reset when query or filters change
  useEffect(() => {
    setPage(1);
  }, [query, sortBy, duration]);

  const apiSortBy = sortBy === 'relevance' ? undefined : (sortBy === 'date' ? 'createdAt' : 'views');
  const apiSortType = sortBy === 'date' || sortBy === 'views' ? 'desc' : undefined;

  const { data, isFetching, isLoading } = useGetAllVideosQuery({
    query,
    page,
    limit: 15,
    sortBy: apiSortBy,
    sortType: apiSortType,
    // Note: duration filtering would need backend support, passing as is for demonstration
    // duration,
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

  const { onIntersect } = useInfiniteScroll(() => setPage(p => p + 1), hasNextPage, isFetching);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-default pb-4 mb-6">
        <h1 className="font-mono text-[12px] text-text-muted uppercase tracking-wider">
          {isLoading && page === 1 ? 'Searching...' : `About ${data?.data?.totalDocs || 0} results for "${query}"`}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-bg-tertiary border border-border-default rounded-full px-4 h-9 font-body text-[13px] text-text-primary focus:border-red focus:ring-1 focus:ring-red outline-none shadow-sm cursor-pointer"
          >
            <option value="relevance">Most relevant</option>
            <option value="date">Upload date</option>
            <option value="views">View count</option>
          </select>
          
          <select 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            className="bg-bg-tertiary border border-border-default rounded-full px-4 h-9 font-body text-[13px] text-text-primary focus:border-red focus:ring-1 focus:ring-red outline-none shadow-sm cursor-pointer"
          >
            <option value="any">Duration: Any</option>
            <option value="short">Short (&lt;4m)</option>
            <option value="medium">Medium (4-20m)</option>
            <option value="long">Long (&gt;20m)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {(!isLoading && videos.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary rounded-xl border border-border-default">
            <svg className="w-16 h-16 text-text-disabled mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h2 className="font-display font-semibold text-[18px] text-text-primary">No results found</h2>
            <p className="font-body text-[14px] text-text-muted mt-1 max-w-sm text-center">
              Try different keywords or remove search filters to find what you're looking for.
            </p>
          </div>
        ) : (
          videos.map((video) => (
            <VideoListItem key={video._id} video={video} />
          ))
        )}
        
        {isFetching && (
           <div className="flex flex-col gap-4 mt-2">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="flex gap-4 p-2">
                 <Skeleton className="w-[168px] aspect-video rounded-lg shrink-0" />
                 <div className="flex-1 flex flex-col gap-2 py-1">
                   <Skeleton className="h-5 w-[80%]" />
                   <Skeleton className="h-4 w-[40%]" />
                   <Skeleton className="h-3 w-[60%] mt-2 hidden sm:block" />
                 </div>
               </div>
             ))}
           </div>
        )}

        <InfiniteScrollSentinel hasMore={hasNextPage} onIntersect={onIntersect} />
      </div>
    </div>
  );
};

export default Search;