"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Row, Col, Card } from "react-bootstrap"
import ActivityTimer from "./ActivityTimer"
import VideoPlayer from "../video-player"
import { concreteStageData, type StageDataMap, type ConcreteStageData } from "../../assets/data/ConcreteStageData"

interface ConcreteStageProps {
  numberRange: { min: number; max: number }
  onStageComplete: (correct: number, total: number) => void
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
}

export default function ConcreteStage({
  numberRange,
  onStageComplete,
  onCorrectAnswer,
  onWrongAnswer,
}: ConcreteStageProps) {
  const getStageKey = (range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max === 5) return "range1"
    if (range.min === 1 && range.max === 10) return "range2"
    return "range1"
  }

  const stageKey = getStageKey(numberRange)
  const stageData: ConcreteStageData[] = concreteStageData[stageKey] || []

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])
  const [currentActivity, setCurrentActivity] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [videoFinished, setVideoFinished] = useState(false)
  const [videoKey, setVideoKey] = useState(0) // Add a key to force video component re-render
  const [isInitialized, setIsInitialized] = useState(false) // Track if component is fully initialized

  // Use refs to track the latest state values and callbacks
  const onStageCompleteRef = useRef(onStageComplete)
  const onCorrectAnswerRef = useRef(onCorrectAnswer)
  const onWrongAnswerRef = useRef(onWrongAnswer)
  const isTransitioningRef = useRef(isTransitioning)
  const videoFinishedRef = useRef(videoFinished)

  // Update refs when props change
  useEffect(() => {
    onStageCompleteRef.current = onStageComplete
    onCorrectAnswerRef.current = onCorrectAnswer
    onWrongAnswerRef.current = onWrongAnswer
  }, [onStageComplete, onCorrectAnswer, onWrongAnswer])

  useEffect(() => {
    isTransitioningRef.current = isTransitioning
  }, [isTransitioning])

  useEffect(() => {
    videoFinishedRef.current = videoFinished
  }, [videoFinished])

  const currentQuestion = stageData.find((v) => v.id === currentActivity)

  // Initialize the first activity
  useEffect(() => {
    console.log("Initializing ConcreteStage with range:", numberRange)
    console.log("Stage key:", stageKey)
    console.log("Stage data:", stageData)

    if (currentActivity === null && stageData.length > 0) {
      console.log("Setting initial activity to:", stageData[0].id)
      setCurrentActivity(stageData[0].id)
      // Mark as initialized after setting the initial activity
      setTimeout(() => {
        setIsInitialized(true)
      }, 500)
    }
  }, [stageData, currentActivity, stageKey, numberRange])

  // Reset states when current activity changes
  useEffect(() => {
    if (currentActivity !== null && isInitialized) {
      console.log("Activity changed to:", currentActivity)
      setSelectedAnswer(null)
      setIsTimerActive(false)
      setTimerKey((prev) => prev + 1)
      setIsTransitioning(false)
      setShowResult(false)
      setVideoFinished(false)
      setVideoKey((prev) => prev + 1) // Force video component to re-render
    }
  }, [currentActivity, isInitialized])

  // Activate timer when video finishes
  useEffect(() => {
    if (videoFinished && isInitialized) {
      console.log("Video finished, activating timer for activity:", currentActivity)
      setIsTimerActive(true)
    }
  }, [videoFinished, currentActivity, isInitialized])

  // Handle stage completion
  useEffect(() => {
    if (completedQuestions.length === stageData.length && stageData.length > 0 && isInitialized) {
      console.log("All questions completed, finishing stage")
      setTimeout(() => {
        onStageCompleteRef.current(correctCount, totalCount)
      }, 2000)
    }
  }, [completedQuestions, stageData.length, correctCount, totalCount, isInitialized])

  const handleVideoEnded = useCallback(() => {
    console.log("Video ended callback triggered for activity:", currentActivity)

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

    console.log("Setting videoFinished to true for activity:", currentActivity)
    setVideoFinished(true)
  }, [currentActivity])

  const handleOptionSelect = useCallback(
    (option: number) => {
      if (selectedAnswer !== null || isTransitioning || !isInitialized) return

      console.log("Option selected:", option)
      setSelectedAnswer(option)
      setIsTimerActive(false)
      setShowResult(true)

      const isCorrect = option === currentQuestion?.correctAnswer
      if (isCorrect) {
        console.log("Correct answer!")
        setCorrectCount((prev) => prev + 1)
        onCorrectAnswerRef.current()
      } else {
        console.log("Wrong answer!")
        onWrongAnswerRef.current()
      }
      setTotalCount((prev) => prev + 1)

      const isLastActivity = completedQuestions.length === stageData.length - 1
      console.log("Is last activity:", isLastActivity)

      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          if (currentActivity !== null) {
            setCompletedQuestions((prev) => {
              const updated = [...prev, currentActivity]
              console.log("Updated completed questions:", updated)
              return updated
            })

            const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

            if (nextVideo) {
              console.log("Moving to next video:", nextVideo.id)
              setCurrentActivity(nextVideo.id)
            } else if (isLastActivity) {
              console.log("No more videos, completing stage")
              onStageCompleteRef.current(correctCount + (isCorrect ? 1 : 0), totalCount + 1)
            }
          }
        }, 1000)
      }, 3000)
    },
    [
      selectedAnswer,
      isTransitioning,
      currentQuestion,
      completedQuestions.length,
      stageData,
      currentActivity,
      correctCount,
      totalCount,
      completedQuestions,
      isInitialized,
    ],
  )

  const handleTimeExpired = useCallback(() => {
    if (selectedAnswer === null && !isTransitioning && isInitialized) {
      console.log("Timer expired")
      setShowResult(true)
      setIsTimerActive(false)
      onWrongAnswerRef.current()
      setTotalCount((prev) => prev + 1)

      const isLastActivity = completedQuestions.length === stageData.length - 1

      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          if (currentActivity !== null) {
            setCompletedQuestions((prev) => [...prev, currentActivity])
            const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

            if (nextVideo) {
              console.log("Moving to next video after timeout:", nextVideo.id)
              setCurrentActivity(nextVideo.id)
            } else if (isLastActivity) {
              console.log("No more videos after timeout, completing stage")
              onStageCompleteRef.current(correctCount, totalCount + 1)
            }
          }
        }, 1000)
      }, 3000)
    }
  }, [
    selectedAnswer,
    isTransitioning,
    completedQuestions,
    stageData,
    currentActivity,
    correctCount,
    totalCount,
    isInitialized,
  ])

  if (currentActivity === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="concrete-stage text-center">
      <Row>
        {currentQuestion && (
          <div>
            <div className="mb-2">
              <span className="badge bg-primary">{`السؤال ${completedQuestions.length + 1} من ${stageData.length}`}</span>
            </div>

            <div className="video-container">
              <VideoPlayer
                key={videoKey}
                src={currentQuestion.url}
                width={530}
                height={300}
                onEnded={handleVideoEnded}
              />
            </div>

            {videoFinished && (
              <div
                className="question-container p-2 mt-3"
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  width: "60%",
                  margin: "0 auto",
                }}
              >
                <h3 className="text-center">{currentQuestion.question}</h3>
                <Row>
                  {currentQuestion.options.map((option, index) => (
                    <Col key={index}>
                      <Card
                        className={`option-card text-center p-3 ${
                          selectedAnswer === option
                            ? option === currentQuestion.correctAnswer
                              ? "border-success bg-success bg-opacity-10"
                              : "border-danger bg-danger bg-opacity-10"
                            : "border"
                        } ${selectedAnswer === null && !isTransitioning ? "hoverable" : ""}`}
                        onClick={() => handleOptionSelect(option)}
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

                {showResult && selectedAnswer === null && (
                  <div className="alert alert-info mt-3 text-center">
                    <p>انتهى الوقت! الإجابة الصحيحة هي: {currentQuestion.correctAnswer}</p>
                  </div>
                )}

                {isTransitioning && <div className="alert alert-info mt-3">جاري الانتقال للسؤال التالي...</div>}

                <ActivityTimer
                  key={timerKey}
                  duration={45}
                  onTimeExpired={handleTimeExpired}
                  isActive={isTimerActive && !isTransitioning}
                />
              </div>
            )}
          </div>
        )}
      </Row>

    </div>
  )
}
