import { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import ActivityTimer from "./ActivityTimer"
import VideoPlayer from "../video-player"
import { concreteStageData } from "../../assets/data/ConcreteStageData"

interface ConcreteStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: () => void
}

export default function ConcreteStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
}: ConcreteStageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showVideo, setShowVideo] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0) // Key to reset the timer
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [currentActivity, setCurrentActivity] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentVideo = concreteStageData.find((v) => v.id === currentActivity)

  // Initialize the first activity when component mounts
  useEffect(() => {
    if (currentActivity === null && concreteStageData.length > 0) {
      setCurrentActivity(concreteStageData[0].id)
    }
  }, [])

  // Reset states when current activity changes
  useEffect(() => {
    if (currentActivity !== null) {
      setShowVideo(true)
      setVideoEnded(false)
      setSelectedAnswer(null)
      setIsTimerActive(false)
      setTimerKey((prev) => prev + 1) // Reset timer
      setIsTransitioning(false)
    }
  }, [currentActivity])

  // Activate timer when video ends
  useEffect(() => {
    if (videoEnded) {
      setIsTimerActive(true)
    }
  }, [videoEnded])

  // Check if all videos are completed and move to next stage
  useEffect(() => {
    if (completedVideos.length === concreteStageData.length && completedVideos.length > 0) {
      // All videos completed, move to next stage
      setTimeout(() => {
        onStageComplete()
      }, 1500) // Delay before moving to next stage
    }
  }, [completedVideos, onStageComplete])

  const handleOptionSelect = (option: number) => {
    if (selectedAnswer !== null || isTransitioning) return // Prevent multiple selections

    setSelectedAnswer(option)
    setIsTimerActive(false) // Stop timer when user selects an answer
    setIsTransitioning(true) // Start transition state

    // Determine if answer is correct
    const isCorrect = option === currentVideo?.correctAnswer

    if (isCorrect) {
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }

    // Add delay before moving to next video/question
    setTimeout(
      () => {
        if (currentActivity !== null) {
          // Add current activity to completed videos
          setCompletedVideos((prev) => [...prev, currentActivity])

          // Find next video that hasn't been completed
          const nextVideo = concreteStageData.find((v) => !completedVideos.includes(v.id) && v.id !== currentActivity)

          if (nextVideo) {
            setCurrentActivity(nextVideo.id)
          }
          // If no next video, the useEffect will handle moving to next stage
        }
      },
      isCorrect ? 2500 : 1500,
    ) // Longer delay for correct answers
  }

  const handleSkipVideo = () => {
    setShowVideo(false)
    setVideoEnded(true)
    setIsTimerActive(true) // Start timer if user skips video
  }

  // Handle timer expiration
  const handleTimeExpired = () => {
    if (selectedAnswer === null && !isTransitioning) {
      setIsTransitioning(true)
      onWrongAnswer()

      // Move to next video after delay
      setTimeout(() => {
        if (currentActivity !== null) {
          setCompletedVideos((prev) => [...prev, currentActivity])

          const nextVideo = concreteStageData.find((v) => !completedVideos.includes(v.id) && v.id !== currentActivity)

          if (nextVideo) {
            setCurrentActivity(nextVideo.id)
          }
        }
      }, 1500)
    }
  }

  if (currentActivity === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="concrete-stage">

      <Row>
        {showVideo && currentVideo ? (
          <div>
            <VideoPlayer
              src={currentVideo.url}
              width={600}
              height={340}
              onEnded={() => {
                setVideoEnded(true)
                setShowVideo(false)
              }}
            />
            <div className="text-center mt-3">
              <Button variant="light" onClick={handleSkipVideo} disabled={isTransitioning}>
                تخطي الفيديو
              </Button>
            </div>
          </div>
        ) : (
          currentVideo && (
            <div className="question-container p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}>
              <ActivityTimer
                key={timerKey}
                duration={45}
                onTimeExpired={handleTimeExpired}
                isActive={isTimerActive && !isTransitioning}
              />
              <h3 className="text-center">{currentVideo.question}</h3>
              <Row className="g-3">
                {currentVideo.options.map((option, index) => (
                  <Col key={index} md={4}>
                    <Card
                      className={`option-card text-center p-3 cursor-pointer ${
                        selectedAnswer === option
                          ? option === currentVideo.correctAnswer
                            ? "border-success bg-success bg-opacity-10"
                            : "border-danger bg-danger bg-opacity-10"
                          : "border"
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      style={{
                        cursor: selectedAnswer === null && !isTransitioning ? "pointer" : "default",
                        transition: "all 0.2s ease-in-out",
                        transform:
                          selectedAnswer === null
                            ? "scale(1)"
                            : selectedAnswer === option
                              ? "scale(1.05)"
                              : "scale(0.98)",
                        boxShadow:
                          selectedAnswer === null
                            ? "0 4px 6px rgba(0,0,0,0.1)"
                            : selectedAnswer === option
                              ? "0 10px 15px rgba(0,0,0,0.1)"
                              : "none",
                        opacity: selectedAnswer !== null && selectedAnswer !== option ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAnswer === null && !isTransitioning) {
                          e.currentTarget.style.transform = "scale(1.05)"
                          e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)"
                          e.currentTarget.style.backgroundColor = "#f8f9fa"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAnswer === null && !isTransitioning) {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"
                          e.currentTarget.style.backgroundColor = ""
                        }
                      }}
                    >
                      <h3 className="mb-0">{option}</h3>
                      {selectedAnswer === option && (
                        <div className="mt-2">
                          {option === currentVideo.correctAnswer ? (
                            <span className="text-success">✓ إجابة صحيحة!</span>
                          ) : (
                            <span className="text-danger">✗ إجابة خاطئة</span>
                          )}
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )
        )}
      </Row>
    </div>
  )
}

