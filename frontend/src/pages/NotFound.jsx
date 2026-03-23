import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] w-full text-center px-4">
      <h1 className="font-display font-extrabold text-[96px] sm:text-[120px] leading-none text-transparent bg-clip-text bg-gradient-to-r from-border-strong to-border-default animate-pulse">
        404
      </h1>
      <h2 className="font-display font-bold text-[24px] sm:text-[32px] text-text-primary mt-4 tracking-tight">
        Page not found
      </h2>
      <p className="font-body text-[15px] sm:text-[16px] text-text-muted mt-2 mb-8 max-w-sm mx-auto leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <Link to="/" tabIndex="-1">
        <Button className="rounded-full bg-red text-white hover:bg-red/90 px-8 h-12 shadow-[0_4px_14px_0_rgba(255,59,59,0.39)] uppercase font-display font-bold tracking-wide">
          Go Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;