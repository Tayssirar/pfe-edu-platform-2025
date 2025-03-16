import { useState, useEffect, type FormEvent } from "react"
import { Row, Col, Card, Form } from "react-bootstrap"
import { motion } from "framer-motion"

interface NumbersStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: () => void

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
  const [attempts, setAttempts] = useState(0)

  // Generate a new question when the component mounts or activity number changes
  useEffect(() => {
    generateQuestion()
    setUserAnswer("")
    setIsCorrect(null)
    setAttempts(0)
  }, [numberRange])



  const generateQuestion = () => {
    // Generate random numbers within the range
    const num1 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min
    const num2 = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min

    // Ensure the sum doesn't exceed the max range
    if (num1 + num2 > numberRange.max) {
      generateQuestion()
      return
    }

    setFirstNumber(num1)
    setSecondNumber(num2)
    setCorrectAnswer(num1 + num2)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const answer = Number.parseInt(userAnswer)

    if (isNaN(answer)) {
      return // Don't process empty or non-numeric answers
    }

    if (answer === correctAnswer) {
      setIsCorrect(true)
      // Add delay before moving to next question
      setTimeout(() => {
        onCorrectAnswer()
      }, 2500)
    } else {
      setIsCorrect(false)
      setAttempts((prev) => prev + 1)

      // Move to next video instead of forcing retries after 2 attempts
      if (attempts >= 1) {
        setTimeout(() => {
          onWrongAnswer()
        }, 1500)
      } else {
        onWrongAnswer()
      }
    }
  }

  return (
    <div className="numbers-stage">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <h4 className="text-end mb-4">أجب على عملية الجمع التالية:</h4>

          <div className="question-container text-center mb-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="display-4 fw-bold">
                {firstNumber} + {secondNumber} = ?
              </h2>
            </motion.div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col md={6}>
                <div className="mb-3 text-end">
                  <Form.Label>أدخل الإجابة:</Form.Label>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="أدخل الإجابة هنا"
                    className="text-center fs-4"
                    disabled={isCorrect === true}
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-lg" disabled={isCorrect === true || userAnswer === ""}>
                    تحقق من الإجابة
                  </button>
                </div>
              </Col>
            </Row>
          </Form>

          {isCorrect !== null && (
            <div className="feedback-container mt-4 text-center">
              {isCorrect ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-success mb-3">
                    <span className="me-2">✓</span>
                    إجابة صحيحة! أحسنت!
                  </h3>
                  <div className="celebration-animation">

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-danger mb-3">
                    <span className="me-2">✗</span>
                    إجابة خاطئة
                  </h3>

                  {attempts >= 2 && (
                    <div className="hint-container p-3 bg-light rounded mb-3">
                      <p className="mb-1">تلميح: حاول استخدام أصابعك للعد!</p>
                      <p className="mb-0">
                        عد {firstNumber} أصابع، ثم أضف {secondNumber} أصابع أخرى، ثم عد المجموع.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setUserAnswer("")
                      setIsCorrect(null)
                    }}
                  >
                    حاول مرة أخرى
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

