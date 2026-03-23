import React from 'react';

const Avatar = ({ src, alt = 'Avatar', name = 'User', size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`rounded-full flex items-center justify-center font-display font-bold bg-red-dim text-red shadow-[0_0_0_2px_var(--border-default)] hover:shadow-[0_0_0_2px_rgba(255,59,59,0.5)] transition-shadow ${sizes[size]} ${className}`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
