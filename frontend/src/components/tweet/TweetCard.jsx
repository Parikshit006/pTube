import React, { useState } from 'react';
import Avatar from '../ui/Avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLikeToggle } from '../../hooks/useLikeToggle';
import { useDeleteTweetMutation, useUpdateTweetMutation } from '../../api/tweetApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const TweetCard = ({ tweet }) => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet?.content);
  const [showMenu, setShowMenu] = useState(false);

  const { isLiked, likeCount, toggleLike } = useLikeToggle('tweet', tweet._id, tweet.likesCount, tweet.isLiked);
  const [deleteTweet] = useDeleteTweetMutation();
  const [updateTweet] = useUpdateTweetMutation();

  const isOwner = user?._id === tweet.owner._id;

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    try {
      await updateTweet({ id: tweet._id, content: editContent }).unwrap();
      setIsEditing(false);
      toast.success('Tweet updated');
    } catch {
      // Handled globally
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this tweet?')) {
      try {
        await deleteTweet(tweet._id).unwrap();
        toast.success('Deleted successfully');
      } catch {}
    }
  };

  return (
    <div className="flex gap-4 p-4 border-b border-border-subtle bg-bg-primary hover:bg-bg-secondary/50 transition-colors group">
      <Avatar src={tweet.owner?.avatar} name={tweet.owner?.username} size="md" className="shrink-0 w-9 h-9" />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-wrap items-center gap-2 truncate">
            <span className="font-body font-medium text-[14px] text-text-primary hover:underline cursor-pointer">
              {tweet.owner?.fullName || tweet.owner?.username}
            </span>
            <span className="font-mono text-[12px] text-text-muted truncate">
              @{tweet.owner?.username}
            </span>
            <span className="font-mono text-[11px] text-text-disabled shrink-0 flex items-center gap-1">
              <span className="w-[3px] h-[3px] bg-text-disabled rounded-full" />
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          {isOwner && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="btn-icon w-7 h-7 text-text-muted hover:text-red focus-visible:ring-red">
                <MoreHorizontal className="w-[15px] h-[15px]" />
              </button>
              {showMenu && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-10 py-1 font-body text-[13px]">
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-bg-overlay text-text-primary">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="w-full text-left px-4 py-2 hover:bg-bg-overlay text-red">
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2 mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-bg-tertiary rounded-lg p-3 font-body text-[14px] outline-none resize-none border border-border-default focus:border-red"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-full font-body text-[13px] text-text-primary hover:bg-bg-elevated transition-colors border border-border-default">Cancel</button>
              <button onClick={handleEditSubmit} className="px-3 py-1.5 rounded-full font-body text-[13px] text-white bg-blue hover:bg-blue/90 transition-colors border border-transparent">Save</button>
            </div>
          </div>
        ) : (
          <div className="font-body text-[15px] text-text-primary whitespace-pre-wrap leading-[1.6]">
            {tweet.content}
          </div>
        )}

        <div className="flex items-center gap-6 mt-3 max-w-sm">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-2 group/action outline-none hover:text-red transition-colors font-mono text-[12px] ${isLiked ? 'text-red' : 'text-text-muted'}`}
          >
            <div className={`p-1.5 rounded-full group-hover/action:bg-red-dim transition-colors group-focus-visible/action:ring-2 ring-red ring-offset-bg-primary ring-offset-1`}>
              <Heart className={`w-[16px] h-[16px] ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span>{likeCount}</span>
          </button>

          <button className="flex items-center gap-2 group/action outline-none hover:text-blue transition-colors font-mono text-[12px] text-text-muted">
            <div className="p-1.5 rounded-full group-hover/action:bg-blue-dim transition-colors group-focus-visible/action:ring-2 ring-blue ring-offset-bg-primary ring-offset-1">
              <MessageCircle className="w-[16px] h-[16px]" />
            </div>
            <span>0</span>
          </button>

          <button className="flex items-center gap-2 group/action outline-none hover:text-green transition-colors font-mono text-[12px] text-text-muted ml-auto sm:ml-0">
            <div className="p-1.5 rounded-full group-hover/action:bg-green/10 transition-colors group-focus-visible/action:ring-2 ring-green ring-offset-bg-primary ring-offset-1">
              <Share2 className="w-[16px] h-[16px]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
