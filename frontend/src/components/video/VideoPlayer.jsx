import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = React.forwardRef(({ options, onReady }, ref) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The videojs() function creates a new wrapper div around the video element.
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        if (onReady) onReady(player);
      });

      if (ref) {
        if (typeof ref === 'function') ref(player);
        else ref.current = player;
      }
    }
  }, [options, videoRef, onReady, ref]);

  // Cleanup on unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div 
        ref={videoRef} 
        className="w-full aspect-video [&_.video-js]:w-full [&_.video-js]:h-full [&_.vjs-control-bar]:bg-gradient-to-t [&_.vjs-control-bar]:from-black/80 [&_.vjs-control-bar]:to-transparent [&_.vjs-control-bar]:border-none [&_.vjs-play-progress]:bg-red [&_.vjs-volume-level]:bg-red [&_.vjs-slider-bar]:bg-white/20 [&_.vjs-control]:font-body" 
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
