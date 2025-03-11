import React, { useEffect, useRef } from "react"

interface VideoPlayerProps {
  src: string
  width?: number
  height?: number
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, width = 300, height = 180 }) => {
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!src.includes("youtube.com") && !src.includes("youtu.be")) return

    const videoId = new URL(src).searchParams.get("v") || src.split("/").pop() // Extract Video ID
    if (!videoId || !videoRef.current) return

    // Load YouTube IFrame API only if not already loaded
    if (!(window as any).YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      tag.async = true
      document.body.appendChild(tag)
    }

    const checkYTReady = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        new (window as any).YT.Player(videoRef.current, {
          height,
          width,
          videoId,
          playerVars: {
            autoplay: 1, // Auto Play
            mute: 0, // Unmute the video to allow sound
            loop: 1, // Loop the video
            modestbranding: 1, // Remove YouTube logo
            controls: 0, // Hide controls
            showinfo: 0,
            rel: 0, // Prevent showing related videos
          },
        })
      } else {
        setTimeout(checkYTReady, 500) // Retry after 500ms
      }
    }

    checkYTReady()
  }, [src, width, height])

  return <div ref={videoRef}></div>
}

export default VideoPlayer
