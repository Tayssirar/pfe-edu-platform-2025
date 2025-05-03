"use client"

import type React from "react"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import ActivityTimer from "./ActivityTimer"
import { numberStageData, type StageDataMap, type NumberStageData } from "../../assets/data/numberStageData"

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

  const [isTrainingStage, setIsTrainingStage] = useState(true) // <-- New state to control phase

  const totalActivities = 10
  const inputRef = useRef<HTMLInputElement>(null)
  const getStageKey = (range: { min: number; max: number }): keyof StageDataMap => {
    if (range.min === 1 && range.max === 5) return "range1"
    if (range.min === 1 && range.max === 10) return "range2"
    return "range1"
  }

  const stageKey = getStageKey(numberRange)
  const stageData: NumberStageData[] = numberStageData[stageKey] || []

  const [questionIndex, setQuestionIndex] = useState(0)

  useEffect(() => {
    if (questionIndex < stageData.length) {
      const { first, second } = stageData[questionIndex]
      setFirstNumber(first)
      setSecondNumber(second)
      setCorrectAnswer(first + second)
    }
  }, [questionIndex, stageData])

  const generateQuestion = () => {
    if (questionIndex < stageData.length) {
      const { first, second } = stageData[questionIndex]
      setFirstNumber(first)
      setSecondNumber(second)
      setCorrectAnswer(first + second)
    }
  }

  const resetState = () => {
    setUserAnswer("")
    setIsCorrect(null)
    setShowAnswer(false)
    setIsTimerActive(true)
    setIsTransitioning(false)
    setTimerKey((prev) => prev + 1)

    setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
  }

  useEffect(() => {

      resetState()
  }, [numberRange])

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

    const correct = answer === correctAnswer

    setIsCorrect(correct)
    setShowAnswer(true)
    setIsTimerActive(false)
    setTotalAnswers((prev) => prev + 1)

    if (!isTrainingStage) {
      // <-- only in second phase we call the parent functions
      if (correct) {
        setCorrectAnswers((prev) => prev + 1)
        onCorrectAnswer()
      } else {
        onWrongAnswer()
      }
    } else {
      if (correct) {
        setCorrectAnswers((prev) => prev + 1) // still count them internally
      }
    }

    setTimeout(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        if (currentActivity < totalActivities) {
          nextQuestion()
        } else {
          if (isTrainingStage) {
            // Training finished -> move to real stage
            setIsTrainingStage(false)
            setCurrentActivity(1)
            setCorrectAnswers(0)
            setTotalAnswers(0)
            setQuestionIndex(10)
            resetState()
          } else {
            // Real stage finished -> complete
            onStageComplete(correctAnswers + (correct ? 1 : 0), totalAnswers + 1)
          }
        }
      }, 1000)
    }, 2000)
  }

  const nextQuestion = () => {
    setCurrentActivity((prev) => prev + 1)
    setQuestionIndex((prev) => {
      const newIndex = prev + 1
      return newIndex
    })
    resetState() 
  }

  const handleTimeExpired = () => {
    if (!isTransitioning && isCorrect === null) {
      setIsTimerActive(false)
      setShowAnswer(true)
      setTotalAnswers((prev) => prev + 1)

      if (!isTrainingStage) {
        onWrongAnswer()
      }

      setTimeout(() => {
        setIsTransitioning(true)

        setTimeout(() => {
          if (currentActivity < totalActivities) {
            nextQuestion()
          } else {
            if (isTrainingStage) {
              setIsTrainingStage(false)
              setCurrentActivity(1)
              setCorrectAnswers(0)
              setTotalAnswers(0)
              resetState()
            } else {
              onStageComplete(correctAnswers, totalAnswers + 1)
            }
          }
        }, 1000)
      }, 3000)
    }
  }

  return (
    <div
      className="text-center "
      style={{ width: "50%", top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute" }}
    >
      <Card className="border-0 shadow-sm p-3 ">
        <ActivityTimer
          key={timerKey}
          duration={60}
          onTimeExpired={handleTimeExpired}
          isActive={isTimerActive && !isTransitioning}
        />
        <Card.Body className="p-4">
          <h4 className="text-end mb-2">
          {isTrainingStage
              ? `مجموعة التدريب: السؤال ${currentActivity} من ${totalActivities}`
              : `المرحلة الرئيسية: السؤال ${currentActivity} من ${totalActivities}`}
          </h4>

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
        </Card.Body>
      </Card>
    </div>
  )
}