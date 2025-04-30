"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import VideoPlayer from "../video-player"
import { fingersStageData, type StageDataMap } from "../../assets/data/FingerStageData"

interface FingersStageProps {
  numberRange: { min: number; max: number }
  onStageComplete: (correct: number, total: number) => void
  onCorrectAnswer: () => void
}

export default function FingersStage({ numberRange, onStageComplete, onCorrectAnswer }: FingersStageProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number | null>(null)
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [videoFinished, setVideoFinished] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoKey, setVideoKey] = useState(0) // Add a key to force video component re-render
  const [isInitialized, setIsInitialized] = useState(false) // Track if component is fully initialized

  // Use refs to track the latest state values in callbacks
  const stageCompleteRef = useRef(onStageComplete)
  const correctAnswerRef = useRef(onCorrectAnswer)
  const isTransitioningRef = useRef(isTransitioning)
  const videoFinishedRef = useRef(videoFinished)
  const completedVideosRef = useRef(completedVideos)

  // Update refs when props change
  useEffect(() => {
    stageCompleteRef.current = onStageComplete
    correctAnswerRef.current = onCorrectAnswer
  }, [onStageComplete, onCorrectAnswer])

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  useEffect(() => {
    videoFinishedRef.current = videoFinished
  }, [videoFinished])

  useEffect(() => {
    completedVideosRef.current = completedVideos
  }, [completedVideos])

  const getStageKey = useCallback((range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max === 5) return "range1"
    if (range.min === 1 && range.max === 10) return "range2"
    return "range1"
  }, [])

  const stageKey = getStageKey(numberRange)
  const stageData = fingersStageData[stageKey] || []

  // Find the current activity by ID
  const currentActivity = stageData.find((v) => v.id === currentActivityIndex)

  // Handle video completion
  const handleVideoEnded = useCallback(() => {
    console.log("Video ended callback triggered for activity:", currentActivityIndex)

    // Prevent handling if already transitioning
    if (isTransitioningRef.current) {
      console.log("Already transitioning, ignoring video end event")
      return
    }

    // Prevent handling if already finished
    if (videoFinishedRef.current) {
      console.log("Video already marked as finished, ignoring duplicate end event")
      return
    }

    console.log("Setting videoFinished to true for activity:", currentActivityIndex)
    setVideoFinished(true)
  }, [currentActivityIndex])

  // Initialize the first activity
  useEffect(() => {
    console.log("Initializing FingersStage with range:", numberRange)
    console.log("Stage key:", stageKey)
    console.log("Stage data:", stageData)

    if (currentActivityIndex === null && stageData.length > 0) {
      console.log("Setting initial activity to:", stageData[0].id)
      setCurrentActivityIndex(stageData[0].id)
      // Mark as initialized after setting the initial activity
      setTimeout(() => {
        setIsInitialized(true)
      }, 500)
    }
  }, [stageData, currentActivityIndex, stageKey, numberRange])

  // Process video completion and handle transitions
  useEffect(() => {
    // Only process if component is fully initialized
    if (!isInitialized) {
      return
    }

    if (videoFinished && !isTransitioning && currentActivity) {
      console.log("Processing video completion for activity:", currentActivity.id)

      // Prevent multiple triggers
      setIsTransitioning(true)

      // Update completed videos and counts
      setCompletedVideos((prev) => {
        const updated = [...prev, currentActivity.id]
        console.log("Updated completed videos:", updated, "out of", stageData.length)
        return updated
      })

      setCorrectCount((prev) => {
        const newCount = prev + 1
        console.log("Updated correct count:", newCount)
        return newCount
      })

      setTotalCount((prev) => {
        const newCount = prev + 1
        console.log("Updated total count:", newCount)
        return newCount
      })

      // Call the correct answer callback
      correctAnswerRef.current()

      // Add delay before transition
      setTimeout(() => {
        // Check if this was the last video
        const updatedCompletedCount = completedVideosRef.current.length + 1
        const isLastVideo = updatedCompletedCount >= stageData.length

        console.log(
          "Completed videos after this one:",
          updatedCompletedCount,
          "Total videos:",
          stageData.length,
          "Is last video:",
          isLastVideo,
        )

        if (isLastVideo) {
          console.log("All videos completed, finishing stage with counts:", correctCount + 1, totalCount + 1)
          stageCompleteRef.current(correctCount + 1, totalCount + 1)
        } else {
          // Find next video
          const currentIdx = stageData.findIndex((v) => v.id === currentActivityIndex)
          const nextIdx = currentIdx + 1

          if (nextIdx < stageData.length) {
            const nextId = stageData[nextIdx].id
            console.log("Moving to next video:", nextId)
            setCurrentActivityIndex(nextId)
            setVideoKey((prev) => prev + 1) // Force video component to re-render
          } else {
            console.log("No more videos in array, completing stage")
            stageCompleteRef.current(correctCount + 1, totalCount + 1)
          }
        }

        // Reset for next video
        setVideoFinished(false)
        setIsTransitioning(false)
      }, 2000)
    }
  }, [
    videoFinished,
    isTransitioning,
    currentActivity,
    stageData,
    currentActivityIndex,
    correctCount,
    totalCount,
    isInitialized,
  ])

  // Reset states when current activity changes
  useEffect(() => {
    if (currentActivityIndex !== null && isInitialized) {
      console.log("Activity changed to:", currentActivityIndex)
      setVideoFinished(false)
      setIsTransitioning(false)
    }
  }, [currentActivityIndex, isInitialized])

  if (!currentActivity) {
    return <div>Loading...</div>
  }

  return (
    <div className="fingers-stage text-center">
      <h4 className="mb-4">شاهد الفيديو التالي 👀</h4>
      <div className="mb-2">
        <span className="badge bg-primary">{`الفيديو ${completedVideos.length + 1} من ${stageData.length}`}</span>
      </div>
      <div className="video-container">
        <VideoPlayer
          key={videoKey}
          src={currentActivity.videoUrl}
          width={710}
          height={400}
          onEnded={handleVideoEnded}
        />
      </div>
      <div className="mt-3">
        {isTransitioning && <div className="alert alert-info">جاري الانتقال للفيديو التالي...</div>}
        <div className="text-muted">
          <small>
            تم مشاهدة {completedVideos.length} من {stageData.length} فيديو
          </small>
        </div>
      </div>


    </div>
  )
}
