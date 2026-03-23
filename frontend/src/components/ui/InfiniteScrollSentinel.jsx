import React, { useEffect, useRef } from 'react';

const InfiniteScrollSentinel = ({ onIntersect, hasMore }) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sentinelRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, onIntersect]);

  return <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />;
};

export default InfiniteScrollSentinel;
