import { useState, useEffect } from "react"
import { Container, Toast, Button, ToastContainer } from "react-bootstrap"
import WelcomeScreen from "./Welcome-screen"
import { getStudentProgress, updateStudentProgress } from "../../api/studentActivity"
import ActivityStage from "../../components/activity/ActivityStage"
import ProgressTracker from "../../components/activity/Progress-tracker"
import failSound from "../../assets/sounds/cartoon-fail-trumpet.mp3"
import successSound from "../../assets/sounds/success-fanfare.mp3"
import confetti from "canvas-confetti"

export default function MathLearningActivity() {
  const [started, setStarted] = useState(false)
  const [currentStage, setCurrentStage] = useState(1) // 1: Concrete, 2: Fingers, 3: Numbers
  const [currentRange, setCurrentRange] = useState({ min: 1, max: 5 })
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [studentProgress, setStudentProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastTitle, setToastTitle] = useState("")
  const [toastVariant, setToastVariant] = useState<"success" | "warning" | "destructive">("success")

  // Simulating student ID - in a real app, this would come from authentication
  const studentId = "student123"

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const progress = await getStudentProgress(studentId)
        setStudentProgress(progress)

        // Set initial stage and range based on student progress
        if (progress) {
          setCurrentStage(progress.currentStage || 1)
          setCurrentRange({
            min: progress.currentRangeMin || 1,
            max: progress.currentRangeMax || 5,
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch student progress:", error)
        setLoading(false)
      }
    }

    fetchStudentProgress()
  }, [studentId])

  const handleStart = () => {
    setStarted(true)
  }

  // Create a custom emoji image or use the emoji directly
  const sadEmoji = confetti.shapeFromText({ text: "😞" }) // You can use any other emoji or image here

  const handleCorrectAnswer = () => {
    setScore((prev) => prev + 1)
    setTotalQuestions((prev) => prev + 1)

    // Play success sound
    const audio = new Audio(successSound)
    audio.play()

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#ff0", "#f00", "#0f0", "#00f"],
    })

    setToastTitle("إجابة صحيحة!")
    setToastMessage("أحسنت! استمر في العمل الجيد")
    setToastVariant("success")
    setShowToast(true)

    // Add a delay before moving to the next activity
    setTimeout(() => {
      // This will be handled by the individual stage components
    }, 6500) // 2.5 second delay for celebration
  }

  const handleWrongAnswer = () => {
    setTotalQuestions((prev) => prev + 1)

    // Play error sound
    const audio = new Audio(failSound)
    audio.play()

    // Trigger sad face emoji confetti effect
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      shapes: [sadEmoji],
      gravity: 0.3, // Adjust gravity to make the particles fall more slowly
      scalar: 1.5, // Adjust size of the emoji particles
    })

    setToastTitle("إجابة خاطئة")
    setToastMessage("حاول مرة أخرى، يمكنك استخدام أصابعك للعد")
    setToastVariant("destructive")
    setShowToast(true)
        // Add a delay before moving to the next activity
        setTimeout(() => {
          // This will be handled by the individual stage components
        }, 6500) // 2.5 second delay for celebration
  }

  const handleRangeComplete = async () => {
    // Check if student performed well (score > 70%)
    const performancePercentage = (score / totalQuestions) * 100

    if (performancePercentage >= 70) {
      // Progress to next range or stage
      if (currentRange.max < 50) {
        // Move to next number range
        let nextRange
        if (currentRange.max === 5) nextRange = { min: 1, max: 10 }
        else if (currentRange.max === 10) nextRange = { min: 1, max: 20 }
        else if (currentRange.max === 20) nextRange = { min: 1, max: 50 }

        if (nextRange) {
          setCurrentRange(nextRange)
        }
        setToastTitle("أحسنت!")
        if (nextRange) {
          setToastMessage(
            `لقد أكملت النطاق ${currentRange.min}-${currentRange.max}. الآن سننتقل إلى النطاق ${nextRange.min}-${nextRange.max}`,
          )
        }
        setToastVariant("success")
        setShowToast(true)
      } else {
        // Completed all ranges
        setToastTitle("تهانينا!")
        setToastMessage("لقد أكملت جميع مراحل التعلم!")
        setToastVariant("success")
        setShowToast(true)
      }
    } else {
      // Student needs to redo the current range
      setToastTitle("تحتاج إلى مزيد من التمرين")
      setToastMessage(`يرجى إعادة النطاق ${currentRange.min}-${currentRange.max} لتحسين مستواك`)
      setToastVariant("warning")
      setShowToast(true)
    }

    // Reset score for next stage/range
    setTotalQuestions(0)

    // Update student progress in database
    try {
      await updateStudentProgress(studentId, {
        currentStage,
        currentRangeMin: currentRange.min,
        currentRangeMax: currentRange.max,
        lastScore: performancePercentage,
      })
    } catch (error) {
      console.error("Failed to update student progress:", error)
    }
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3">جاري تحميل النشاط...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-1">
      {!started ? (
        <WelcomeScreen onStart={handleStart} studentProgress={studentProgress} />
      ) : (
        <div className="activity-container">
          <ProgressTracker
            score={score}
            totalQuestions={totalQuestions}
            currentStage={currentStage}
            currentRange={currentRange}
          />

          <ActivityStage
          setCurrentStage={setCurrentStage}
            numberRange={currentRange}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            onStageComplete={handleRangeComplete}
          />

          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setStarted(false)} className="me-2">
              العودة إلى الصفحة الرئيسية
            </Button>

            <Button onClick={handleRangeComplete}>إنهاء المرحلة</Button>
          </div>
        </div>
      )}

      <ToastContainer position="top-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant === "destructive" ? "danger" : toastVariant === "success" ? "success" : "warning"}
        >
          <Toast.Header>
            <strong className="me-auto">{toastTitle}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

