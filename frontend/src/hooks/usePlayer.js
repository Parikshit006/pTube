import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export const usePlayer = (options, onReady) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'ptube-player-theme');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
      }
    };
  }, [options, videoRef, onReady]);

  return {
    videoRef,
    playerRef,
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    seek: (time) => playerRef.current && (playerRef.current.currentTime(time)),
    currentTime: () => playerRef.current?.currentTime() || 0,
    duration: () => playerRef.current?.duration() || 0,
    volume: (val) => {
      if (val !== undefined && playerRef.current) {
        playerRef.current.volume(val);
      }
      return playerRef.current?.volume() || 1;
    }
  };
};
