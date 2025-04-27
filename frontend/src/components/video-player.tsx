import React from "react";
import YouTube, { YouTubeEvent } from "react-youtube";

interface VideoPlayerProps {
  src: string;
  width?: number;
  height?: number;
  onEnded?: () => void;
  loop?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, width = 600, height = 340, onEnded }) => {
  // Extract video ID from the URL
  const videoId = new URL(src).searchParams.get("v") || src.split("/").pop();

  if (!videoId) return <p>Invalid video URL</p>;

  const options = {
    width: width.toString(),
    height: height.toString(),
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1, // minimal branding
      rel: 0,             // only related videos from same channel
      showinfo: 0,        // deprecated but can still help
    },
  };
  

  return (
    <YouTube
      videoId={videoId}
      opts={options}
      onEnd={(event: YouTubeEvent) => {
        if (onEnded) onEnded();
      }}
    />
  );
};

export default VideoPlayer;
