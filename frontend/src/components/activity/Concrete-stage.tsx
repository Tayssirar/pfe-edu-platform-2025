"use client"

import { useState, useEffect } from "react"
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

  const currentQuestion = stageData.find((v) => v.id === currentActivity)

  useEffect(() => {
    if (currentActivity === null && stageData.length > 0) {
      setCurrentActivity(stageData[0].id)
    }
  }, [stageData, currentActivity])

  useEffect(() => {
    if (currentActivity !== null) {
      setSelectedAnswer(null)
      setIsTimerActive(false)
      setTimerKey((prev) => prev + 1)
      setIsTransitioning(false)
      setShowResult(false)
      setVideoFinished(false)
    }
  }, [currentActivity])

  useEffect(() => {
    if (videoFinished) {
      setIsTimerActive(true)
    }
  }, [videoFinished])

  useEffect(() => {
    if (completedQuestions.length === stageData.length && stageData.length > 0) {
      setTimeout(() => {
        onStageComplete(correctCount, totalCount)
      }, 6500)
    }
  }, [completedQuestions, onStageComplete, stageData.length, correctCount, totalCount])

  const handleOptionSelect = (option: number) => {
    if (selectedAnswer !== null || isTransitioning) return

    setSelectedAnswer(option)
    setIsTimerActive(false)
    setShowResult(true)

    const isCorrect = option === currentQuestion?.correctAnswer
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
      onCorrectAnswer()
    } else {
      onWrongAnswer()
    }
    setTotalCount((prev) => prev + 1)

    const isLastActivity = completedQuestions.length === stageData.length - 1

    setTimeout(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        if (currentActivity !== null) {
          setCompletedQuestions((prev) => [...prev, currentActivity])
          const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

          if (nextVideo) {
            setCurrentActivity(nextVideo.id)
          } else if (isLastActivity) {
            onStageComplete(correctCount + (isCorrect ? 1 : 0), totalCount + 1)
          }
        }
      }, 1000)
    }, 8000)
  }

  const handleTimeExpired = () => {
    if (selectedAnswer === null && !isTransitioning) {
      setShowResult(true)
      setIsTimerActive(false)
      onWrongAnswer()
      setTotalCount((prev) => prev + 1)

      const isLastActivity = completedQuestions.length === stageData.length - 1

      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          if (currentActivity !== null) {
            setCompletedQuestions((prev) => [...prev, currentActivity])
            const nextVideo = stageData.find((v) => !completedQuestions.includes(v.id) && v.id !== currentActivity)

            if (nextVideo) {
              setCurrentActivity(nextVideo.id)
            } else if (isLastActivity) {
              onStageComplete(correctCount, totalCount + 1)
            }
          }
        }, 1000)
      }, 13000)
    }
  }

  if (currentActivity === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="concrete-stage text-center " >
      <Row>
        {currentQuestion && (
          <div>
            <VideoPlayer src={currentQuestion.url} width={530} height={300} onEnded={() => setVideoFinished(true)} />

            {videoFinished && (
              <div className="question-container p-2"                style={{
                backgroundColor: "white",
                borderRadius: "10px",
                width: "60%",
                margin: "0 auto",
              }}>
                <h3 className="text-center">{currentQuestion.question}</h3>
                <Row >
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
