 
import { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import ActivityTimer from "./ActivityTimer"
import VideoPlayer from "../video-player"
import { concreteStageData, type StageDataMap, type ConcreteStageData } from "../../assets/data/ConcreteStageData"

interface ConcreteStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: (correct: number, total: number) => void
}

export default function ConcreteStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
}: ConcreteStageProps) {
  // Map the number range to a specific stage key
  const getStageKey = (range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max === 5) return "range1"
    if (range.min === 1 && range.max === 10) return "range2"
    if (range.min === 1 && range.max === 15) return "range3"
    return "range1" // default fallback
  }

  const stageKey = getStageKey(numberRange)
  const stageData: ConcreteStageData[] = concreteStageData[stageKey] || []

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showVideo, setShowVideo] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0) // Key to reset the timer
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])
  const [currentActivity, setCurrentActivity] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // Get the current video from the stage data
  const currentQuestion = stageData.find((v) => v.id === currentActivity)

  // Initialize the first activity when component mounts
  useEffect(() => {
    if (currentActivity === null && stageData.length > 0) {
      setCurrentActivity(stageData[0].id)
    }
  }, [stageData, currentActivity])

  // Reset states when current activity changes
  useEffect(() => {
    if (currentActivity !== null) {
      setShowVideo(true)
      setVideoEnded(false)
      setSelectedAnswer(null)
      setIsTimerActive(false)
      setTimerKey((prev) => prev + 1) // Reset timer
      setIsTransitioning(false)
      setShowResult(false)
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
    if (completedQuestions.length === stageData.length && stageData.length > 0) {
      // All videos completed, move to next stage after a delay
      setTimeout(() => {
        onStageComplete(correctCount, totalCount)
      }, 1500)
    }
  }, [completedQuestions, onStageComplete, stageData.length, correctCount, totalCount])

  const handleOptionSelect = (option: number) => {
    if (selectedAnswer !== null || isTransitioning) return // Prevent multiple selections

    setSelectedAnswer(option)
    setIsTimerActive(false) // Stop timer when user selects an answer
    setShowResult(true) // Show result before transitioning
    setTotalCount((prev) => prev + 1)

    // Determine if answer is correct
    const isCorrect = option === currentQuestion?.correctAnswer

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }

    // Add delay before transitioning to next video/question
    // This allows the user to see the result first
    setTimeout(() => {
      setIsTransitioning(true)

      // Add delay before moving to next video/question
      setTimeout(() => {
        if (currentActivity !== null) {
          // Add current activity to completed videos
          setCompletedQuestions((prev) => [...prev, currentActivity])

          // Find next video that hasn't been completed
          const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

          if (nextVideo) {
            setCurrentActivity(nextVideo.id)
          }
          // If no next video, the useEffect will handle moving to next stage
        }
      }, 1000)
    }, 2000) // Show result for 2 seconds
  }

  const handleSkipVideo = () => {
    setShowVideo(false)
    setVideoEnded(true)
    setIsTimerActive(true) // Start timer if user skips video
  }

  // Handle timer expiration
  const handleTimeExpired = () => {
    if (selectedAnswer === null && !isTransitioning) {
      setShowResult(true) // Show the correct answer
      setTotalCount((prev) => prev + 1)
      setIsTimerActive(false)
      onWrongAnswer()

      // Add delay to show the correct answer
      setTimeout(() => {
        setIsTransitioning(true)

        // Move to next video after delay
        setTimeout(() => {
          if (currentActivity !== null) {
            setCompletedQuestions((prev) => [...prev, currentActivity])

            const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

            if (nextVideo) {
              setCurrentActivity(nextVideo.id)
            }
          }
        }, 1000)
      }, 3000) // Show correct answer for 3 seconds
    }
  }

  if (currentActivity === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="concrete-stage">
      <Row>
        {showVideo && currentQuestion ? (
          <div>
            <VideoPlayer
              src={currentQuestion.url}
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
          currentQuestion && (
            <div className="question-container p-4" style={{ backgroundColor: "white", borderRadius: "10px" }}>
              <ActivityTimer
                key={timerKey}
                duration={45}
                onTimeExpired={handleTimeExpired}
                isActive={isTimerActive && !isTransitioning}
              />
              <h3 className="text-center">{currentQuestion.question}</h3>
              <Row >
                {currentQuestion.options.map((option, index) => (
                  <Col key={index} >
                    <Card
                      className={`option-card text-center p-3 ${
                        selectedAnswer === option
                          ? option === currentQuestion.correctAnswer
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
                      {showResult && (
                        <div className="mt-2">
                          {option === currentQuestion.correctAnswer ? (
                            <span className="text-success">✓ إجابة صحيحة!</span>
                          ) : selectedAnswer === option ? (
                            <span className="text-danger">✗ إجابة خاطئة</span>
                          ) : null}
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Show correct answer when timer expires */}
              {showResult && selectedAnswer === null && (
                <div className="alert alert-info mt-3 text-center">
                  <p>انتهى الوقت! الإجابة الصحيحة هي: {currentQuestion.correctAnswer}</p>
                </div>
              )}
            </div>
          )
        )}
      </Row>
    </div>
  )
}

