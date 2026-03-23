import { useCallback } from 'react';

export const useInfiniteScroll = (fetchNextPage, hasNextPage, isFetching) => {
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  return { onIntersect };
};
