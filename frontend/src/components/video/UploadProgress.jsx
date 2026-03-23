import React from 'react';
import { useSelector } from 'react-redux';

const UploadProgress = () => {
  const { uploadProgress } = useSelector((state) => state.ui);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-primary/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex flex-col items-center max-w-[400px] w-full p-8 text-center animate-in zoom-in-95 duration-300">
        
        <div className="relative w-32 h-32 mb-8 select-none">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-border-default stroke-current"
              strokeWidth="6"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            <circle
              className="text-red stroke-current transition-all duration-300 ease-out"
              strokeWidth="6"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={40 * 2 * Math.PI}
              strokeDashoffset={40 * 2 * Math.PI - (uploadProgress / 100) * (40 * 2 * Math.PI)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-[32px] text-text-primary tracking-tight">
              {Math.round(uploadProgress)}<span className="text-[20px] text-text-muted">%</span>
            </span>
          </div>
        </div>

        <h2 className="font-display font-semibold text-[20px] text-text-primary tracking-tight mb-2">
          Uploading Video...
        </h2>
        <p className="font-body text-[14px] text-text-secondary leading-relaxed mb-8 max-w-[280px]">
          Please don't close this window until the upload is complete.
        </p>

        <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#ff6b6b] to-[#ff3b3b] shadow-[0_0_10px_rgba(255,59,59,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
