import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoInfo from '../components/video/VideoInfo';
import VideoActions from '../components/video/VideoActions';
import CommentList from '../components/comment/CommentList';
import SubscribeButton from '../components/channel/SubscribeButton';
import Avatar from '../components/ui/Avatar';
import { useGetVideoByIdQuery, useGetAllVideosQuery } from '../api/videoApi';
import VideoListItem from '../components/video/VideoListItem';
import Skeleton from '../components/ui/Skeleton';
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal';
import { Link } from 'react-router-dom';
import { formatCount } from '../utils/formatters';

const Watch = () => {
  const { videoId } = useParams();
  const { data: videoData, isLoading } = useGetVideoByIdQuery(videoId);
  const { data: relatedData } = useGetAllVideosQuery({ page: 1, limit: 15, sortBy: 'views' });
  
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);

  const video = videoData?.data;
  const relatedVideos = relatedData?.data?.docs?.filter(v => v._id !== videoId) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <div className="flex-1 w-full min-w-0">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="w-3/4 h-8 mt-4 rounded-md" />
          <Skeleton className="w-1/2 h-4 mt-2 rounded-md" />
        </div>
        <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2 mb-4">
               <Skeleton className="w-[160px] h-[90px] rounded-lg shrink-0" />
               <div className="flex-1 space-y-2 mt-1">
                 <Skeleton className="w-full h-4" />
                 <Skeleton className="w-[60%] h-3" />
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!video) return <div className="p-8 text-center text-red">Video not found.</div>;

  const playerOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{ src: video.videoFile, type: 'video/mp4' }]
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mx-auto w-full">
      {/* Left Column (Video + Details) */}
      <div className="flex-1 min-w-0 flex flex-col w-full">
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <VideoPlayer options={playerOptions} />
        </div>
        
        <VideoInfo 
          title={video.title} 
          views={video.views} 
          createdAt={video.createdAt} 
          description={video.description} 
          tags={video.tags}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 py-4 border-b border-border-default">
          <div className="flex flex-1 items-center justify-between sm:justify-start gap-4 mr-0 sm:mr-4">
            <Link to={`/channel/${video.owner?.username}`} className="flex items-center gap-3 shrink-0 group">
              <Avatar src={video.owner?.avatar} name={video.owner?.username} size="lg" className="w-[42px] h-[42px]" />
              <div className="flex flex-col">
                <span className="font-display font-semibold text-[15px] text-text-primary group-hover:text-red transition-colors">{video.owner?.fullName || video.owner?.username}</span>
                <span className="font-mono text-[12px] text-text-muted">{formatCount(video.owner?.subscribersCount)} subscribers</span>
              </div>
            </Link>
            <SubscribeButton channelId={video.owner?._id} initialSubscribed={video.owner?.isSubscribed} />
          </div>
          
          <div className="flex-shrink-0 self-start sm:self-auto w-full sm:w-auto mt-2 sm:mt-0">
             <VideoActions 
               videoId={video._id} 
               initialLikes={video.likesCount} 
               isLiked={video.isLiked} 
               onSave={() => setPlaylistModalOpen(true)}
             />
          </div>
        </div>
        
        <CommentList videoId={video._id} totalComments={video.commentsCount || 0} />
      </div>

      {/* Right Column (Related) */}
      <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-y-auto cs-scroll pb-6 pt-2">
        <h3 className="font-display font-semibold text-[16px] text-text-primary mb-4 px-2">Up Next</h3>
        <div className="flex flex-col gap-2 w-full">
          {relatedVideos.map((rv) => (
             <VideoListItem key={rv._id} video={rv} />
          ))}
        </div>
      </div>
      
      {isPlaylistModalOpen && (
        <AddToPlaylistModal isOpen={isPlaylistModalOpen} onClose={() => setPlaylistModalOpen(false)} videoId={video._id} />
      )}
    </div>
  );
};

export default Watch;