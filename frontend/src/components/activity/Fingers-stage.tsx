import { useState, useEffect } from "react"
import { Row, Col, Button } from "react-bootstrap"
import Image from "react-bootstrap/Image"
import VideoPlayer from "../video-player"
import ActivityTimer from "./ActivityTimer"
import { fingersStageData } from "../../assets/data/FingerStageData"

interface FingersStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: () => void
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

  // Initialize the first activity when component mounts
  useEffect(() => {
    if (currentActivity === null && fingersStageData.length > 0) {
      setCurrentActivity(fingersStageData[0].id)
    }
  }, [])

  // Select the current data based on activityNumber
  const currentQuestion = fingersStageData.find((data) => data.id === currentActivity)

  // Reset states when current activity changes
  useEffect(() => {
    if (currentActivity !== null) {
      setShowVideo(true)
      setVideoEnded(false)
      setInputAnswer("")
      setSubmittedAnswer(null)
      setIsTimerActive(false)
      setTimerKey((prev) => prev + 1)
      setIsTransitioning(false)
    }
  }, [currentActivity])

  // Activate timer when video ends
  useEffect(() => {
    if (videoEnded) {
      setIsTimerActive(true)
    }
  }, [videoEnded])

  // Check if all questions are completed and move to next stage
  useEffect(() => {
    if (completedQuestions.length === fingersStageData.length && completedQuestions.length > 0) {
      // All questions completed, move to next stage
      setTimeout(() => {
        onStageComplete()
      }, 1500) // Delay before moving to next stage
    }
  }, [completedQuestions, onStageComplete])

  const handleSubmitAnswer = () => {
    if (!currentQuestion || isTransitioning || inputAnswer === "") return

    const numericAnswer = Number(inputAnswer)
    setSubmittedAnswer(numericAnswer)
    setIsTimerActive(false) // Stop timer when user submits an answer
    setIsTransitioning(true) // Start transition state

    // Determine if answer is correct
    const isCorrect = numericAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }

    // Add delay before moving to next question
    setTimeout(
      () => {
        if (currentActivity !== null) {
          // Add current activity to completed questions
          setCompletedQuestions((prev) => [...prev, currentActivity])

          // Find next question that hasn't been completed
          const nextQuestion = fingersStageData.find(
            (data) => !completedQuestions.includes(data.id) && data.id !== currentActivity,
          )

          if (nextQuestion) {
            setCurrentActivity(nextQuestion.id)
          }
          // If no next question, the useEffect will handle moving to next stage
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
    if (submittedAnswer === null && !isTransitioning) {
      setIsTransitioning(true)
      onWrongAnswer()

      // Move to next question after delay
      setTimeout(() => {
        if (currentActivity !== null) {
          setCompletedQuestions((prev) => [...prev, currentActivity])

          const nextQuestion = fingersStageData.find(
            (data) => !completedQuestions.includes(data.id) && data.id !== currentActivity,
          )

          if (nextQuestion) {
            setCurrentActivity(nextQuestion.id)
          }
        }
      }, 1500)
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
              <Row className="justify-content-center align-items-center">
                <Col xs={5} className="text-center">
                  <div className="fingers-container">
                    <Image
                      src={currentQuestion.firstNumberImage || "/placeholder.svg"}
                      alt={`${currentQuestion.firstNumber} fingers`}
                      width={150}
                      height={150}
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
                      width={150}
                      height={150}
                      className="img-fluid"
                    />
                  </div>
                  <p className="mt-2 mb-0">عدد الأصابع: {currentQuestion.secondNumber}</p>
                </Col>
              </Row>

              <div className="text-center mt-3">
                <h3 className="mb-0">
                  {currentQuestion.firstNumber} + {currentQuestion.secondNumber} = ?
                </h3>
                <p className="text-muted mt-2">استخدم أصابعك للعد والحصول على الإجابة</p>
              </div>

              <div className="answers-container mt-4">
                <div className="d-flex justify-content-center">
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="number"
                      value={inputAnswer}
                      className="form-control text-center"
                      placeholder="أدخل الإجابة"
                      onChange={(e) => setInputAnswer(e.target.value)}
                      disabled={submittedAnswer !== null || isTransitioning}
                      style={{ fontSize: "1.2rem" }}
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

                {submittedAnswer !== null && (
                  <div className="feedback-container mt-4 text-center">
                    {submittedAnswer === currentQuestion.correctAnswer ? (
                      <div className="alert alert-success">
                        <h5 className="mb-0">✓ إجابة صحيحة! أحسنت!</h5>
                        <div className="mt-2">
                          {/* Simple celebration animation */}
                          <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🎉</span>
                          <span style={{ fontSize: "1.5rem" }}>🌟</span>
                        </div>
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

