import { useState } from 'react';
import { useToggleVideoLikeMutation, useToggleCommentLikeMutation, useToggleTweetLikeMutation } from '../api/likeApi';
import toast from 'react-hot-toast';

export const useLikeToggle = (type, id, initialCount = 0, initialLiked = false) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  
  const [toggleVideoLike] = useToggleVideoLikeMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();
  const [toggleTweetLike] = useToggleTweetLikeMutation();

  const toggleLike = async () => {
    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (type === 'video') await toggleVideoLike(id).unwrap();
      else if (type === 'comment') await toggleCommentLike(id).unwrap();
      else if (type === 'tweet') await toggleTweetLike(id).unwrap();
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error('Failed to toggle like');
    }
  };

  return { isLiked, likeCount, toggleLike };
};
