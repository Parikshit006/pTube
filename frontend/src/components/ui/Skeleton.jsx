import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div 
      className={`animate-shimmer rounded bg-gradient-to-r from-bg-tertiary via-border-default to-bg-tertiary bg-[length:600px_100%] ${className}`} 
    />
  );
};

export default Skeleton;
