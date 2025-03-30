 
import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Row, Col, Button } from "react-bootstrap"
import Image from "react-bootstrap/Image"
import VideoPlayer from "../video-player"
import ActivityTimer from "./ActivityTimer"
import { fingersStageData, type StageDataMap } from "../../assets/data/FingerStageData"

interface FingersStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: (correct: number, total: number) => void
}

export default function FingersStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
}: FingersStageProps) {
  const [inputAnswer, setInputAnswer] = useState<string>("")
  const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null)
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
  const inputRef = useRef<HTMLInputElement>(null)

  // Map the number range to a specific stage key
  const getStageKey = (range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max === 5) return "range1"
    if (range.min === 1 && range.max === 10) return "range2"
    if (range.min === 1 && range.max === 15) return "range3"
    return "range1" // default fallback
  }

  const stageKey = getStageKey(numberRange)
  const stageData = fingersStageData[stageKey] || []

  // Get the current question from the stage data
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
      setInputAnswer("")
      setSubmittedAnswer(null)
      setTimerKey((prev) => prev + 1) // Reset timer
      setIsTransitioning(false)
      setShowResult(false)
    }
  }, [currentActivity])

  // Activate timer when video ends
  useEffect(() => {
    if (videoEnded) {
      setIsTimerActive(true)

      // Focus on input when video ends
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 500)
    }
  }, [videoEnded])

  // Check if all questions are completed and move to next stage
  useEffect(() => {
    if (completedQuestions.length === stageData.length && stageData.length > 0) {
      // All questions completed, move to next stage after a delay
      setTimeout(() => {
        onStageComplete(correctCount, totalCount)
      }, 1500)
    }
  }, [completedQuestions, onStageComplete, stageData.length, correctCount, totalCount])

  /**
   * Handles the submission of an answer
   * Validates the answer, shows feedback, and manages transition to next question
   */
  const handleSubmitAnswer = () => {
    if (!currentQuestion || isTransitioning || inputAnswer === "") return

    const numericAnswer = Number(inputAnswer)
    setSubmittedAnswer(numericAnswer)
    setIsTimerActive(false) // Stop timer when user submits an answer
    setShowResult(true) // Show result before transitioning
    setTotalCount((prev) => prev + 1)

    // Determine if answer is correct
    const isCorrect = numericAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }

    // Add delay before transitioning to next question
    setTimeout(() => {
      setIsTransitioning(true)

      // Add delay before moving to next question
      setTimeout(() => {
        if (currentActivity !== null) {
          // Add current activity to completed questions
          setCompletedQuestions((prev) => [...prev, currentActivity])

          // Find next question that hasn't been completed
          const nextQuestion = stageData.find(
            (data) => !completedQuestions.includes(data.id) && data.id !== currentActivity,
          )

          if (nextQuestion) {
            setCurrentActivity(nextQuestion.id)
          }
        }
      }, 1000)
    }, 2000) // Show result for 2 seconds before transitioning
  }

  /**
   * Handles keyboard events for the input field
   * Submits the answer when Enter key is pressed
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmitAnswer()
    }
  }

  /**
   * Handles skipping the video
   * Shows the question immediately and activates the timer
   */
  const handleSkipVideo = () => {
    setShowVideo(false)
    setVideoEnded(true)
    setIsTimerActive(true)

    // Focus on input after skipping video
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 500)
  }

  /**
   * Handles timer expiration
   * Shows the correct answer and manages transition to next question
   */
  const handleTimeExpired = () => {
    if (submittedAnswer === null && !isTransitioning) {
      setShowResult(true) // Show the correct answer
      setTotalCount((prev) => prev + 1)
      onWrongAnswer()

      // Add delay to show the correct answer
      setTimeout(() => {
        setIsTransitioning(true)

        // Move to next question after delay
        setTimeout(() => {
          if (currentActivity !== null) {
            setCompletedQuestions((prev) => [...prev, currentActivity])

            const nextQuestion = stageData.find(
              (data) => !completedQuestions.includes(data.id) && data.id !== currentActivity,
            )

            if (nextQuestion) {
              setCurrentActivity(nextQuestion.id)
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
    <div className="fingers-stage">
      <Row>
        {showVideo && currentQuestion ? (
          <div>
            <VideoPlayer
              src={currentQuestion.videoUrl}
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
              <Row className="justify-content-center align-items-center mt-2">
                <Col xs={5} className="text-center">
                  <div className="fingers-container">
                    <Image
                      src={currentQuestion.firstNumberImage || "/placeholder.svg"}
                      alt={`${currentQuestion.firstNumber} fingers`}
                      width={50}
                      height={50}
                      className="img-fluid"
                    />
                  </div>
                  <p className="mt-2 mb-0">عدد الأصابع: {currentQuestion.firstNumber}</p>
                </Col>

                <Col xs={2} className="text-center">
                  <span className="fs-1">+</span>
                </Col>

                <Col xs={5} className="text-center">
                  <div className="fingers-container">
                    <Image
                      src={currentQuestion.secondNumberImage || "/placeholder.svg"}
                      alt={`${currentQuestion.secondNumber} fingers`}
                      width={50}
                      height={50}
                      className="img-fluid"
                    />
                  </div>
                  <p className="mt-2 mb-0">عدد الأصابع: {currentQuestion.secondNumber}</p>
                </Col>
              </Row>

              <div className="text-center mt-2">
                <h3 className="mb-0">
                  {currentQuestion.firstNumber} + {currentQuestion.secondNumber} = ?
                </h3>
                <p className="text-muted mt-2">استخدم أصابعك للعد والحصول على الإجابة</p>
              </div>

              <div className="answers-container mt-2">
                <div className="d-flex justify-content-center">
                  <div className="input-group" style={{ maxWidth: "300px", direction: "ltr" }}>
                    <input
                      type="number"
                      value={inputAnswer}
                      className="form-control text-center"
                      placeholder="أدخل الإجابة"
                      onChange={(e) => setInputAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={submittedAnswer !== null || isTransitioning}
                      style={{ fontSize: "1.2rem" }}
                      ref={inputRef}
                    />
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={inputAnswer === "" || submittedAnswer !== null || isTransitioning}
                      variant="primary"
                    >
                      تحقق
                    </Button>
                  </div>
                </div>

                {showResult && (
                  <div className="feedback-container mt-2 text-center">
                    {submittedAnswer === currentQuestion.correctAnswer ? (
                      <div className="alert alert-success">
                        <h5 className="mb-0">✓ إجابة صحيحة! أحسنت!</h5>
                      </div>
                    ) : (
                      <div className="alert alert-danger">
                        <h5 className="mb-0">✗ إجابة خاطئة</h5>
                        <p className="mt-2 mb-0">الإجابة الصحيحة هي: {currentQuestion.correctAnswer}</p>
                        <p className="mt-2 mb-0">تذكر أن تستخدم أصابعك للعد!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </Row>
    </div>
  )
}