import React, { useState } from 'react';
import Switch from '../ui/Switch';
import { Edit, Trash2 } from 'lucide-react';
import { formatViews } from '../../utils/formatters';
import Skeleton from '../ui/Skeleton';

const VideoStatsTable = ({ videos = [], isLoading, onEdit, onDelete, onTogglePublish }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-bg-primary rounded-xl border border-border-default overflow-hidden mt-6 overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border-default bg-bg-secondary w-full">
              {['Status', 'Video', 'Views', 'Likes', 'Date', 'Actions'].map((c, i) => (
                <th key={i} className="py-4 px-6"><Skeleton className="h-4 w-16" /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border-default group">
                <td className="py-4 px-6"><Skeleton className="h-6 w-11 rounded-full" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-48" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                <td className="py-4 px-6"><Skeleton className="h-6 w-16" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
       <div className="w-full bg-bg-primary rounded-xl border border-border-default overflow-hidden mt-6 flex p-8 justify-center text-text-muted font-body">
         No videos found. Upload one to see it here.
       </div>
    );
  }

  return (
    <div className="w-full bg-bg-primary rounded-xl border border-border-default overflow-hidden mt-6 overflow-x-auto">
      <table className="w-full min-w-[700px] text-left border-collapse">
        <thead>
          <tr className="border-b border-border-default bg-bg-secondary font-display font-semibold text-[12px] text-text-disabled uppercase tracking-wider">
            <th className="py-4 px-6 font-medium">Status</th>
            <th className="py-4 px-6 font-medium">Video</th>
            <th className="py-4 px-6 font-medium">Views</th>
            <th className="py-4 px-6 font-medium">Likes</th>
            <th className="py-4 px-6 font-medium">Published</th>
            <th className="py-4 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video._id} className="border-b border-border-subtle group hover:bg-bg-tertiary transition-colors last:border-none">
              <td className="py-4 px-6 align-middle">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={video.isPublished} 
                    onChange={() => onTogglePublish(video)}
                  />
                  <span className={`text-[12px] font-mono ${video.isPublished ? 'text-green' : 'text-text-muted'}`}>
                    {video.isPublished ? 'Public' : 'Private'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onEdit(video)}>
                  <div className="w-[60px] h-[34px] sm:w-[80px] sm:h-[45px] rounded border border-border-default overflow-hidden shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-body font-medium text-[13px] sm:text-[14px] text-text-primary line-clamp-2 leading-tight">
                    {video.title}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 font-mono text-[12px] text-text-muted align-middle">
                {formatViews(video.views)}
              </td>
              <td className="py-4 px-6 font-mono text-[12px] text-text-muted align-middle">
                {formatViews(video.likesCount)}
              </td>
              <td className="py-4 px-6 font-mono text-[12px] text-text-muted align-middle">
                {new Date(video.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-6 text-right align-middle">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onEdit(video)}
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(video)}
                    className="p-2 text-text-muted hover:text-red hover:bg-bg-elevated rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoStatsTable;
