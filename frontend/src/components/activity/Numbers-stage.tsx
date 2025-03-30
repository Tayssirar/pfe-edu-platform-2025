import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import ActivityTimer from "./ActivityTimer"

interface NumbersStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: (correct: number, total: number) => void
}

export default function NumbersStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
}: NumbersStageProps) {
  const [firstNumber, setFirstNumber] = useState(0)
  const [secondNumber, setSecondNumber] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [currentActivity, setCurrentActivity] = useState(1)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalActivities = 10
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    generateQuestion()
    resetState()

    // Focus on input when component mounts
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 500)
  }, [numberRange])

  const resetState = () => {
    setUserAnswer("")
    setIsCorrect(null)
    setShowAnswer(false)
    setIsTimerActive(true)
    setIsTransitioning(false)
    setTimerKey((prev) => prev + 1) // Restart the timer

    // Focus on input when state resets
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 500)
  }

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min
    const num2 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min

    if (num1 + num2 > numberRange.max) {
      generateQuestion()
      return
    }
    setFirstNumber(num1)
    setSecondNumber(num2)
    setCorrectAnswer(num1 + num2)
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    submitAnswer()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submitAnswer()
    }
  }

  const submitAnswer = () => {
    if (isTransitioning || userAnswer === "") return

    const answer = Number.parseInt(userAnswer)
    if (isNaN(answer)) return

    setIsCorrect(answer === correctAnswer)
    setShowAnswer(true) // Always show result
    setIsTimerActive(false) // Stop timer
    setTotalAnswers((prev) => prev + 1)

    if (answer === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1)
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }

    // Add delay to show the result before moving on
    setTimeout(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        if (currentActivity < totalActivities) {
          nextQuestion()
        } else {
          onStageComplete(correctAnswers, totalAnswers)
        }
      }, 1000)
    }, 2000) // Show result for 2 seconds
  }

  const nextQuestion = () => {
    setCurrentActivity((prev) => prev + 1)
    generateQuestion()
    resetState()
  }

  const handleTimeExpired = () => {
    if (!isTransitioning && isCorrect === null) {
      setIsTimerActive(false)
      setShowAnswer(true)
      setTotalAnswers((prev) => prev + 1)
      onWrongAnswer()

      // Add delay to show the correct answer
      setTimeout(() => {
        setIsTransitioning(true)

        setTimeout(() => {
          if (currentActivity < totalActivities) {
            nextQuestion()
          } else {
            onStageComplete(correctAnswers, totalAnswers + 1)
          }
        }, 1000)
      }, 3000) // Show correct answer for 3 seconds
    }
  }

  return (
    <div className="numbers-stage">
      <Card className="border-0 shadow-sm mb-2">
        <ActivityTimer
          key={timerKey}
          duration={45}
          onTimeExpired={handleTimeExpired}
          isActive={isTimerActive && !isTransitioning}
        />
        <Card.Body className="p-4">
          <h4 className="text-end mb-2">{`السؤال ${currentActivity} من ${totalActivities}`}</h4>

          <div className="question-container text-center mb-2">
            <h2 className="display-4 fw-bold">
              {firstNumber} + {secondNumber} = ?
            </h2>
          </div>

          <Row className="justify-content-center">
            <Col md={8}>
              <span>أدخل الإجابة:</span>
              <div className="input-group" style={{ direction: "ltr" }}>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="أدخل الإجابة هنا"
                  className="form-control text-center"
                  disabled={isCorrect !== null || isTransitioning}
                  ref={inputRef}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isCorrect !== null || userAnswer === "" || isTransitioning}
                  variant="primary"
                >
                  تحقق
                </Button>
              </div>
            </Col>
          </Row>

          {showAnswer && (
            <div className="feedback-container mt-4 text-center">
              {isCorrect ? (
                <div className="alert alert-success">
                  <h4>
                    <span className="me-2">✓</span> إجابة صحيحة! أحسنت!
                  </h4>
                </div>
              ) : (
                <div className="alert alert-danger">
                  <h4>
                    <span className="me-2">✗</span> إجابة خاطئة
                  </h4>
                  <div className="mt-2">
                    <p>الإجابة الصحيحة: {correctAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentActivity >= totalActivities && isTransitioning && (
            <div className="text-center mt-2">
              <h5>لقد أكملت جميع الأنشطة!</h5>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

