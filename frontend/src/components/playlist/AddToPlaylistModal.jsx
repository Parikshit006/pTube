import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import { useGetUserPlaylistsQuery, useAddVideoToPlaylistMutation, useRemoveVideoFromPlaylistMutation, useCreatePlaylistMutation } from '../../api/playlistApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';

const AddToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useSelector((state) => state.auth);
  const { data: playlistsData, isLoading } = useGetUserPlaylistsQuery(user?._id, { skip: !user?._id });
  
  const [addVideo] = useAddVideoToPlaylistMutation();
  const [removeVideo] = useRemoveVideoFromPlaylistMutation();
  const [createPlaylist] = useCreatePlaylistMutation();
  
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const playlists = playlistsData?.data || [];

  const handleToggle = async (playlist, isAdded) => {
    try {
      if (isAdded) {
        await removeVideo({ videoId, playlistId: playlist._id }).unwrap();
      } else {
        await addVideo({ videoId, playlistId: playlist._id }).unwrap();
      }
    } catch {
      toast.error('Failed to update playlist');
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const res = await createPlaylist({ 
        name: newTitle.trim(), 
        description: 'Saved playlist' 
      }).unwrap();
      // automatically add video to new playlist
      await addVideo({ videoId, playlistId: res.data._id }).unwrap();
      toast.success(res.message || 'Playlist created & video added');
      setNewTitle('');
      setShowNew(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save video to...">
      <div className="flex flex-col gap-2 min-h-[150px]">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="flex flex-col max-h-[250px] overflow-y-auto cs-scroll px-1">
            {playlists.map((playlist) => {
              const isAdded = playlist.videos?.some(v => v._id === videoId) || playlist.videos?.includes(videoId);
              return (
                <label key={playlist._id} className="flex items-center gap-3 p-2 hover:bg-bg-tertiary rounded-lg cursor-pointer cursor-checkbox">
                  <input 
                    type="checkbox" 
                    checked={isAdded}
                    onChange={() => handleToggle(playlist, isAdded)}
                    className="w-[18px] h-[18px] rounded-[4px] border-border-default text-purple focus:ring-purple focus:ring-opacity-50 transition-colors accent-purple"
                  />
                  <span className="font-body text-[14px] text-text-primary truncate flex-1">{playlist.name}</span>
                </label>
              );
            })}
            {playlists.length === 0 && (
              <p className="text-center font-body text-[13px] text-text-muted py-4">You have no playlists yet.</p>
            )}
          </div>
        )}
        
        <div className="border-t border-border-subtle mt-2 pt-3 h-px w-full shrink-0" />
        
        {showNew ? (
          <div className="flex flex-col gap-3 mt-2">
            <input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter playlist name..."
              maxLength={100}
              autoFocus
              className="w-full bg-bg-tertiary border border-border-default rounded-lg px-3 h-10 font-body text-[14px] focus:border-purple focus-visible:ring-0 outline-none"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="button" onClick={handleCreate} isLoading={isCreating} disabled={!newTitle.trim()} size="sm" className="bg-purple text-white hover:bg-purple/90 h-8 text-xs px-4">Create</Button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowNew(true)}
            className="flex items-center justify-center gap-2 mt-2 py-2 hover:bg-bg-tertiary rounded-lg transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-purple"
          >
            <Plus className="w-4 h-4 text-purple" />
            <span className="font-body text-[14px] font-medium text-text-primary group-hover:text-purple transition-colors">Create new playlist</span>
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AddToPlaylistModal;
