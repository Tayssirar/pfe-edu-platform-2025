import { useState, useEffect } from "react"
import { Container, Button, Modal } from "react-bootstrap"
import ProgressTracker from "../../components/activity/Progress-tracker"
import ActivityStage from "../../components/activity/ActivityStage"
import { updateStudentProgress } from "../../api/studentActivity"
import failSound from "../../assets/sounds/cartoon-fail-trumpet.mp3"
import successSound from "../../assets/sounds/success-fanfare.mp3"
import confetti from "canvas-confetti"

interface MathLearningActivityProps {
  studentProgress: any // Progress passed from WelcomeScreen
  studentId: string // Student ID passed from WelcomeScreen
}

const MathLearningActivity: React.FC<MathLearningActivityProps> = ({ studentProgress, studentId }) => {
  const [started, setStarted] = useState(true) // Start as true since we are in the activity
  const [currentStage, setCurrentStage] = useState(studentProgress?.currentStage || 1)
  const [currentRange, setCurrentRange] = useState({
    min: studentProgress?.currentRangeMin || 1,
    max: studentProgress?.currentRangeMax || 5,
  })
  const [score, setScore] = useState(studentProgress?.score || 0)
  const [totalQuestions, setTotalQuestions] = useState(studentProgress?.totalQuestions || 0)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false) // Set to false initially
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [modalVariant, setModalVariant] = useState<"success" | "warning" | "danger">("success")
  const [resetStage, setResetStage] = useState(false) // New state to handle stage reset

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showModal) {
      timer = setTimeout(() => setShowModal(false), 4000)
    }
    return () => clearTimeout(timer)
  }, [showModal])

  // Save progress to backend
  const saveProgress = async (stageScore: { correct: number; total: number }) => {
    const { correct, total } = stageScore;
    const newStageData = {
      range: `${currentRange.min}-${currentRange.max}`, // e.g., "1-5"
      stage: currentStage,
      correct,
      total,
      date: new Date().toISOString(),
    };
  
    const progressData = {
      currentStage,
      currentRangeMin: currentRange.min,
      currentRangeMax: currentRange.max,
      score: score + correct,
      totalQuestions: totalQuestions + total,
      stageScores: [...(studentProgress.stageScores || []), newStageData],
      lastUpdated: new Date().toISOString(),
    };
  
    try {
      setLoading(true);
      await updateStudentProgress(studentId, progressData);
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleCorrectAnswer = () => {
    setScore((prev: number) => prev + 1)
    setTotalQuestions((prev: number) => prev + 1)

    new Audio(successSound).play().catch((err) => console.error("Error playing sound:", err))
    confetti({ particleCount: 100, spread: 120, origin: { x: 0.5, y: 0.5 } })
  }

  const handleWrongAnswer = () => {
    setTotalQuestions((prev: number) => prev + 1)

    new Audio(failSound).play().catch((err) => console.error("Error playing sound:", err))
  }

  const handleStageComplete = (stageScore: { correct: number; total: number; shouldRedo: boolean }) => {
    const { correct, total, shouldRedo } = stageScore;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const totalStages = 3; // Concrete, Finger, Number
  
    if (shouldRedo) {
      setModalTitle("تحتاج إلى مزيد من التدريب");
      setModalMessage(`النتيجة: ${percentage}%. يجب عليك إعادة هذه المرحلة.`);
      setModalVariant("danger");
    } else if (percentage >= 70) {
      setModalTitle("تهانينا!");
      setModalMessage(`لقد أكملت المرحلة ${currentStage}! استعد للمرحلة التالية.`);
      setModalVariant("success");
      saveProgress({ correct, total }) // Save progress after completing a stage
  
      if (currentStage < totalStages) {
        // Move to the next stage
        setCurrentStage((prev: number) => prev + 1);
      } else if (currentRange.max < 50) {
        // Move to the next range and reset to stage 1
        const nextRange = {
          min: currentRange.min,
          max: currentRange.max + 5 > 50 ? 50 : currentRange.max + 5,
        };
        setCurrentRange(nextRange);
        setCurrentStage(1);
  

      } else {
        // Reached the final range limit
        setModalTitle("ممتاز!");
        setModalMessage("لقد أكملت جميع المراحل! أحسنت العمل 👏.");
        setModalVariant("success");
      }
    } else {
      setModalTitle("جيد");
      setModalMessage(`لقد أكملت المرحلة ${currentStage}. النتيجة: ${percentage}%. ركز أكثر على المحتوى.`);
      setModalVariant("warning");
      saveProgress({ correct, total }) // Provide default values for correct and total
  
      if (currentStage < totalStages) {
        // Continue to the next stage
        setCurrentStage((prev: number) => prev + 1);
      } else if (currentRange.max < 50) {
        // Proceed to next range and reset to stage 1
        const nextRange = {
          min: currentRange.min,
          max: currentRange.max + 5 > 50 ? 50 : currentRange.max + 5,
        };
        setCurrentRange(nextRange);
        setCurrentStage(1);
  

      } else {
        setModalTitle("ممتاز!");
        setModalMessage("لقد أكملت جميع المراحل! أحسنت العمل 👏.");
        setModalVariant("success");
      }
    }
    setShowModal(true);
  };
  

  const handleTryAgain = () => {
    setShowModal(false); // Close the modal
    setResetStage(true); // Trigger a reset
    setTimeout(() => setResetStage(false), 0); // Reset the flag after forcing a re-render
  };

  return (
    <Container className="py-1">
      <div className="activity-container">
        <ProgressTracker
          score={score}
          totalQuestions={totalQuestions}
          currentStage={currentStage}
          currentRange={currentRange}
        />
        {!resetStage && (
          <ActivityStage
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            numberRange={currentRange}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            onStageComplete={handleStageComplete}
          />
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={`bg-${modalVariant} text-white`}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          {modalVariant === "danger" ? (
            <Button variant="danger" onClick={handleTryAgain}>
              إعادة المحاولة
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setShowModal(false)}>
              متابعة
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MathLearningActivity

