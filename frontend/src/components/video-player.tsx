"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import YouTube, { type YouTubeEvent, type YouTubeProps } from "react-youtube"

interface VideoPlayerProps {
  src: string
  width?: number
  height?: number
  onEnded?: () => void
  loop?: number
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, width = 600, height = 340, onEnded }) => {
  const [isReady, setIsReady] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [playerState, setPlayerState] = useState(-1)
  const playerRef = useRef<any>(null)
  const endedCallbackRef = useRef(onEnded)
  const videoIdRef = useRef<string | null>(null)

  // Update the callback ref when onEnded changes
  useEffect(() => {
    endedCallbackRef.current = onEnded
  }, [onEnded])

  // Extract video ID from the URL
  const getVideoId = (url: string): string | null => {
    try {
      // Handle youtu.be format
      if (url.includes("youtu.be")) {
        return url.split("/").pop()?.split("?")[0] || null
      }

      // Handle youtube.com format
      if (url.includes("youtube.com")) {
        const urlObj = new URL(url)
        return urlObj.searchParams.get("v") || url.split("/").pop() || null
      }

      // If it's just an ID
      return url
    } catch (error) {
      console.error("Error parsing YouTube URL:", error)
      return url // Return the original string as fallback
    }
  }

  const videoId = getVideoId(src)

  // Store the video ID in a ref for comparison
  useEffect(() => {
    videoIdRef.current = videoId
  }, [videoId])

  if (!videoId) return <p>Invalid video URL</p>

  const options: YouTubeProps["opts"] = {
    width: width.toString(),
    height: height.toString(),
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1, // minimal branding
      rel: 0, // only related videos from same channel
      showinfo: 0, // deprecated but can still help
      // Disable suggested videos at the end to prevent auto-navigation
      fs: 1,
      playsinline: 1,
      enablejsapi: 1,
    },
  }

  const handleReady = (event: YouTubeEvent) => {
    console.log("YouTube player ready for video:", videoId)
    playerRef.current = event.target
    setIsReady(true)
    setHasEnded(false)

    // Start playing the video
    try {
      event.target.playVideo()
    } catch (error) {
      console.error("Error playing video:", error)
    }
  }

  const handleStateChange = (event: YouTubeEvent) => {
    // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    const state = event.data
    console.log("YouTube player state changed for video", videoId, ":", state)
    setPlayerState(state)

    if (state === 0 && !hasEnded) {
      // 0 is the "ended" state
      console.log("Video", videoId, "ended, calling onEnded callback")
      setHasEnded(true)

      // Use a timeout to ensure the callback is not called too early
      setTimeout(() => {
        if (endedCallbackRef.current) {
          console.log("Executing onEnded callback for video:", videoId)
          endedCallbackRef.current()
        }
      }, 500)
    }
  }

  return (
    <div className="video-player-container">
      <YouTube videoId={videoId} opts={options} onReady={handleReady} onStateChange={handleStateChange} />

    </div>
  )
}

export default VideoPlayer
