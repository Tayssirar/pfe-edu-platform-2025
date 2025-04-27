"use client"

// Fingers-stage.tsx
import { useState, useEffect } from "react"
import VideoPlayer from "../video-player"
import { fingersStageData, type StageDataMap } from "../../assets/data/FingerStageData"

interface FingersStageProps {
  numberRange: { min: number; max: number }
  onStageComplete: (correct: number, total: number) => void
  onCorrectAnswer: () => void
}

export default function FingersStage({ numberRange, onStageComplete, onCorrectAnswer }: FingersStageProps) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // Simplified stage key logic
  const getStageKey = (range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max <= 5) return "range1"
    return "range2"
  }

  const stageKey = getStageKey(numberRange)
  const stageData = fingersStageData[stageKey] || []
  const currentActivity = stageData[currentActivityIndex]

  // Handle video end: update progress and auto-advance
  const handleVideoEnd = () => {
    if (currentActivity) {
      setCompletedVideos((prev) => [...prev, currentActivity.id]);
      setCorrectCount((prev) => prev + 1);
      setTotalCount((prev) => prev + 1);

      // Call onCorrectAnswer to update the parent component's state
      onCorrectAnswer();

      // Move to next video after a short delay
      setTimeout(() => {
        const nextIndex = currentActivityIndex + 1;
        if (nextIndex < stageData.length) {
          setCurrentActivityIndex(nextIndex);
        }
      }, 1500);
    }
  };

  // When all videos are watched, complete the stage
  useEffect(() => {
    if (completedVideos.length === stageData.length && stageData.length > 0) {
      setTimeout(() => {
        onStageComplete(correctCount, totalCount)
      }, 1000)
    }
  }, [completedVideos, stageData.length, correctCount, totalCount, onStageComplete])

  if (!currentActivity) return <div>Loading...</div>

  return (
    <div className="fingers-stage text-center">
      <h4 className="mb-4">شاهد الفيديو التالي 👀</h4>
      <div className="mb-2">
        <span className="badge bg-primary">{`الفيديو ${currentActivityIndex + 1} من ${stageData.length}`}</span>
      </div>
      <VideoPlayer src={currentActivity.videoUrl} width={710} height={400} onEnded={handleVideoEnd} />
    </div>
  )
}
