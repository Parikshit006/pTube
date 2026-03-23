import React, { useState } from 'react';
import { useGetUserPlaylistsQuery, useCreatePlaylistMutation } from '../api/playlistApi';
import { useSelector } from 'react-redux';
import PlaylistGrid from '../components/playlist/PlaylistGrid';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

const Playlists = () => {
  const { user } = useSelector(state => state.auth);
  const { data, isLoading } = useGetUserPlaylistsQuery(user?._id, { skip: !user?._id });
  const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();

  const playlists = data?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const res = await createPlaylist({ 
        name: name.trim(), 
        description: desc.trim() || 'My playlist description' 
      }).unwrap();
      toast.success(res.message || 'Playlist created text');
      setIsModalOpen(false);
      setName('');
      setDesc('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create playlist');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pt-2 pb-4 border-b border-border-default">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-text-primary leading-tight">Your Playlists</h1>
          <p className="font-body text-[14px] text-text-muted mt-1">Collections of your favorite videos.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-text-primary text-bg-primary hover:bg-text-secondary rounded-full px-5 shadow-md">
          <Plus className="w-5 h-5" />
          <span className="font-body font-medium text-[14px]">New Playlist</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-text-muted font-body">Loading...</div>
      ) : (
        <PlaylistGrid playlists={playlists} />
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a Playlist">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Title <span className="text-red">*</span></label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="My awesome playlist"
                className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Description</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={200}
                placeholder="Optional description"
                rows={3}
                className="w-full p-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleCreate} disabled={!name.trim()} isLoading={isCreating} className="bg-red text-white">Create</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Playlists;