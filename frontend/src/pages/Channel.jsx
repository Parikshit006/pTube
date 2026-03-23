import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelHeader from '../components/channel/ChannelHeader';
import EditProfileModal from '../components/channel/EditProfileModal';
import VideoGrid from '../components/video/VideoGrid';
import TweetFeed from '../components/tweet/TweetFeed';
import PlaylistGrid from '../components/playlist/PlaylistGrid';
import { useGetChannelProfileQuery, useUpdateAccountMutation } from '../api/userApi';
import { useGetAllVideosQuery } from '../api/videoApi';
import { useGetUserTweetsQuery } from '../api/tweetApi';
import { useGetUserPlaylistsQuery } from '../api/playlistApi';
import { useSelector } from 'react-redux';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const Channel = () => {
  const { username } = useParams();
  const { user } = useSelector((state) => state.auth);
  
  const { data: profileData, isLoading: profileLoading } = useGetChannelProfileQuery(username, {
    skip: !username,
  });
  const profile = profileData?.data;
  const isOwner = user?.username === username;

  const [activeTab, setActiveTab] = useState('Videos');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [updateAccount] = useUpdateAccountMutation();

  const handleUpdateProfile = async (data) => {
    try {
      await updateAccount(data).unwrap();
      toast.success('Profile updated');
    } catch {
      // Error handled
    }
  };

  const tabs = ['Videos', 'Tweets', 'Playlists', 'About'];

  return (
    <div className="flex flex-col w-full min-h-screen relative">
      <div className="w-full h-[120px] sm:h-[160px] md:h-[200px] overflow-hidden bg-bg-secondary border-b border-border-default -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] relative group">
        {profileLoading ? (
          <Skeleton className="w-full h-full rounded-none" />
        ) : (
          profile?.coverImage ? (
            <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-gradient-to-tr from-bg-tertiary to-border-default opacity-50" />
          )
        )}
      </div>

      <div className="px-2 mt-4">
        <ChannelHeader 
          profile={profile} 
          isLoading={profileLoading} 
          isOwner={isOwner} 
          onEditClick={() => setIsEditModalOpen(true)} 
        />

        <div className="border-b border-border-subtle mt-4">
          <div className="flex gap-6 overflow-x-auto cs-scroll">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-display font-semibold text-[15px] sm:text-[16px] transition-colors relative outline-none focus-visible:text-red ${
                  activeTab === tab 
                    ? 'text-text-primary' 
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          {activeTab === 'Videos' && <ChannelVideos userId={profile?._id} />}
          {activeTab === 'Tweets' && <ChannelTweets userId={profile?._id} />}
          {activeTab === 'Playlists' && <ChannelPlaylists userId={profile?._id} />}
          {activeTab === 'About' && <ChannelAbout profile={profile} />}
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          user={profile} 
          onSave={handleUpdateProfile} 
        />
      )}
    </div>
  );
};

// Sub-components to keep clean
const ChannelVideos = ({ userId }) => {
  const { data, isFetching } = useGetAllVideosQuery({ userId, page: 1, limit: 20 }, { skip: !userId });
  if (!userId) return null;
  return <VideoGrid videos={data?.data?.docs} isLoading={isFetching} />;
};

const ChannelTweets = ({ userId }) => {
  const { data, isFetching } = useGetUserTweetsQuery(userId, { skip: !userId });
  if (!userId) return null;
  return <div className="max-w-[600px]"><TweetFeed tweets={data?.data} isFetching={isFetching} /></div>;
};

const ChannelPlaylists = ({ userId }) => {
  const { data, isFetching } = useGetUserPlaylistsQuery(userId, { skip: !userId });
  if (!userId) return null;
  if (isFetching) return <div className="p-4"><Skeleton className="w-[200px] h-[150px] rounded-xl" /></div>;
  return <PlaylistGrid playlists={data?.data || []} />;
};

const ChannelAbout = ({ profile }) => (
  <div className="flex flex-col max-w-2xl bg-bg-secondary p-6 rounded-xl border border-border-default gap-4">
    <h3 className="font-display font-semibold text-[18px]">Description</h3>
    <p className="font-body text-[15px] text-text-secondary whitespace-pre-wrap">{profile?.description || "This channel hasn't provided a description yet."}</p>
    
    <div className="h-px bg-border-subtle my-2" />
    
    <h3 className="font-display font-semibold text-[18px]">Details</h3>
    <div className="flex flex-col gap-2 font-mono text-[13px] text-text-muted">
      <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
        <span>Joined</span>
        <span className="text-text-primary">{new Date(profile?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
        <span>Total views across videos</span>
        <span className="text-text-primary">{profile?.viewsCount || 0}</span>
      </div>
    </div>
  </div>
);

export default Channel;