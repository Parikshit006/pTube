import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPlaylistByIdQuery, useRemoveVideoFromPlaylistMutation } from '../api/playlistApi';
import PlaylistQueue from '../components/playlist/PlaylistQueue';
import { useSelector } from 'react-redux';
import { Play, Shuffle } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { formatCount, formatDuration } from '../utils/formatters';
import toast from 'react-hot-toast';

const Playlist = () => {
  const { playlistId } = useParams();
  const { user } = useSelector(state => state.auth);
  
  const { data, isLoading } = useGetPlaylistByIdQuery(playlistId);
  const [removeVideo] = useRemoveVideoFromPlaylistMutation();
  
  const playlist = data?.data;
  const isOwner = user?._id === playlist?.owner?._id;

  const handleRemove = async (videoId) => {
    try {
      await removeVideo({ videoId, playlistId }).unwrap();
      toast.success('Video removed from playlist');
    } catch {
      toast.error('Failed to remove video');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 mx-auto w-full pb-8">
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="w-3/4 h-6 mt-4" />
          <Skeleton className="w-1/2 h-4 mt-2" />
        </div>
        <div className="flex-1 w-full flex flex-col gap-2 pt-2">
          {Array.from({length: 4}).map((_, i) => (
             <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) return <div className="text-red p-8 text-center font-display font-semibold">Playlist not found</div>;

  const videos = playlist.videos || [];
  const totalDuration = videos.reduce((acc, v) => acc + (v.duration || 0), 0);
  const coverImage = videos[0]?.thumbnail || 'https://via.placeholder.com/640x360.png?text=No+Videos';

  return (
    <div className="flex flex-col lg:flex-row gap-8 mx-auto w-full pb-8 items-start relative">
      
      {/* Left fixed panel */}
      <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 bg-bg-secondary p-4 sm:p-6 rounded-2xl border border-border-default lg:sticky lg:top-[72px] shadow-sm relative overflow-hidden flex flex-col gap-4">
        {/* Blurred background effect behind panel content */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl saturate-200 pointer-events-none z-0" 
          style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="relative z-10 aspect-video rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <img src={coverImage} alt={playlist.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="relative z-10 mt-2 flex flex-col gap-2">
          <h1 className="font-display font-bold text-[20px] sm:text-[24px] text-text-primary leading-tight">
            {playlist.name}
          </h1>
          
          <div className="flex flex-col gap-[2px]">
            <span className="font-body font-medium text-[14px] text-text-primary">
              {playlist.owner?.fullName || playlist.owner?.username}
            </span>
            <div className="font-mono text-[12px] text-text-muted flex items-center gap-1.5 opacity-80 mt-1">
              <span className="text-[13px]">{formatCount(videos.length)} videos</span>
              <span className="w-1 h-1 rounded-full bg-border-strong" />
              <span>{formatDuration(totalDuration)} total</span>
            </div>
            <div className="font-body text-[14px] text-text-secondary mt-3 whitespace-pre-wrap leading-relaxed">
              {playlist.description || "No description provided."}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-3 mt-4 w-full">
          <Button disabled={videos.length === 0} className="flex-1 rounded-full bg-red text-white py-[18px] text-[15px] font-display font-bold shadow-lg shadow-red/20 focus-visible:ring-offset-bg-secondary group hover:-translate-y-px transition-all">
            <Play className="w-[18px] h-[18px] mr-2 fill-current" /> Play all
          </Button>
          <Button disabled={videos.length === 0} variant="ghost" className="btn-icon w-12 shrink-0 bg-bg-tertiary border border-border-default shadow-sm hover:border-text-muted rounded-full">
            <Shuffle className="w-5 h-5 text-text-primary" />
          </Button>
        </div>
      </div>

      {/* Right scrollable queue */}
      <div className="flex-1 w-full flex flex-col pb-16 pt-2">
        <PlaylistQueue 
          videos={videos} 
          isOwner={isOwner} 
          onRemove={handleRemove} 
        />
      </div>

    </div>
  );
};

export default Playlist;