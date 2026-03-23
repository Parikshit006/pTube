import React from 'react';
import PlaylistCard from './PlaylistCard';
import { Link } from 'react-router-dom';

const PlaylistGrid = ({ playlists = [] }) => {
  if (playlists.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-bg-secondary border border-border-default rounded-xl">
        <p className="font-body text-[14px] text-text-muted">No playlists found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 w-full">
      {playlists.map((playlist) => (
        <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple rounded-xl block transition-all hover:bg-bg-secondary p-2 -m-2">
           <PlaylistCard playlist={playlist} />
        </Link>
      ))}
    </div>
  );
};

export default PlaylistGrid;
