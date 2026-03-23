import React, { useState } from 'react';
import Avatar from '../ui/Avatar';
import { ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLikeToggle } from '../../hooks/useLikeToggle';
import CommentInput from './CommentInput';
import { useSelector } from 'react-redux';
import { useUpdateCommentMutation, useDeleteCommentMutation } from '../../api/commentApi';
import toast from 'react-hot-toast';

const CommentItem = ({ comment }) => {
  const { user } = useSelector((state) => state.auth);
  const { isLiked, likeCount, toggleLike } = useLikeToggle('comment', comment._id, comment.likesCount, comment.isLiked);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const isOwner = user?._id === comment.owner?._id;

  const handleEdit = async (content) => {
    try {
      await updateComment({ id: comment._id, content }).unwrap();
      setIsEditing(false);
      toast.success('Comment updated');
    } catch {
      // Handled globally
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete comment?')) {
      try {
        await deleteComment(comment._id).unwrap();
        toast.success('Comment deleted');
      } catch {}
    }
  };

  if (isEditing) {
    return (
      <div className="py-4">
        <CommentInput user={user} onSubmit={handleEdit} initialValue={comment.content} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-4 group hover:bg-bg-primary/50 transition-colors rounded-xl px-2 -mx-2">
      <Avatar src={comment.owner?.avatar} name={comment.owner?.username} size="sm" className="shrink-0 w-8 h-8 object-cover mt-1" />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-body font-medium text-[13px] text-text-primary hover:text-red cursor-pointer transition-colors max-w-[200px] truncate">
            @{comment.owner?.username}
          </span>
          <span className="font-mono text-[11px] text-text-muted shrink-0">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
          
          {isOwner && (
            <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setShowMenu(!showMenu)} className="btn-icon w-6 h-6 hover:bg-bg-tertiary">
                <MoreVertical className="w-[14px] h-[14px]" />
              </button>
              {showMenu && (
                <div className="absolute top-full right-0 mt-1 w-24 bg-bg-elevated border border-border-default rounded-lg shadow-lg z-10 py-1 font-body text-[13px]">
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-1.5 hover:bg-bg-overlay text-text-primary">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="w-full text-left px-3 py-1.5 hover:bg-bg-overlay text-red">
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="font-body text-[14px] text-text-primary leading-[1.5] whitespace-pre-wrap break-words">
          {comment.content}
        </p>
        
        <div className="flex items-center gap-4 mt-2">
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-1 hover:text-red transition-colors font-body text-[12px] group/btn focus-visible:ring-2 focus-visible:ring-red rounded pr-2 ${isLiked ? 'text-red' : 'text-text-muted'}`}
          >
            <div className="p-1.5 rounded-full group-hover/btn:bg-red-dim transition-colors">
              <ThumbsUp className={`w-[14px] h-[14px] ${isLiked ? 'fill-current' : ''}`} />
            </div>
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          
          <button className="flex items-center gap-1 hover:text-text-primary transition-colors text-text-muted font-body text-[12px] group/btn focus-visible:ring-2 focus-visible:ring-red rounded">
            <div className="p-1.5 rounded-full group-hover/btn:bg-bg-tertiary transition-colors">
              <ThumbsDown className="w-[14px] h-[14px]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
