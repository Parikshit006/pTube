import React, { useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { useGetVideoCommentsQuery, useAddCommentMutation } from '../../api/commentApi';
import { useSelector } from 'react-redux';
import Skeleton from '../ui/Skeleton';
import toast from 'react-hot-toast';

const CommentList = ({ videoId, totalComments = 0 }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data: commentsResponse, isLoading, isFetching } = useGetVideoCommentsQuery({ videoId, page, limit });
  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

  const handleAddComment = async (content) => {
    try {
      await addComment({ videoId, content }).unwrap();
      toast.success('Comment added');
    } catch {
      // error handled by interceptor
    }
  };

  const comments = commentsResponse?.data?.docs || [];

  return (
    <div className="flex flex-col mt-6">
      <div className="flex items-center gap-6 mb-6">
        <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-text-primary">
          {totalComments} Comments
        </h3>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-bg-tertiary px-3 py-1.5 rounded-full transition-colors text-text-primary">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h10M4 18h6" />
          </svg>
          <span className="font-body font-medium text-[14px]">Sort by</span>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="mb-6">
          <CommentInput user={user} onSubmit={handleAddComment} isLoading={isAdding} />
        </div>
      ) : (
        <div className="bg-bg-secondary p-4 rounded-xl text-center font-body text-text-muted mb-6">
          Please <a href="/login" className="text-red hover:underline">sign in</a> to add a comment.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {isLoading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 w-full mt-1">
                <Skeleton className="w-[30%] h-3" />
                <Skeleton className="w-[80%] h-3" />
                <Skeleton className="w-[60%] h-3" />
              </div>
            </div>
          ))
        )}
        
        {!isLoading && comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
        
        {!isLoading && comments.length === 0 && (
          <p className="text-text-muted font-body text-[14px] text-center mt-4">
            No comments yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentList;
