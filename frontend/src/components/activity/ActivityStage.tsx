import type React from "react"

import { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import ConcreteStage from "./Concrete-stage"
import FingersStage from "./Fingers-stage"
import NumbersStage from "./Numbers-stage"

interface ActivityStageProps {
  numberRange: { min: number; max: number }
  onCorrectAnswer: () => void
  onWrongAnswer: () => void
  onStageComplete: (stageScore: { correct: number; total: number; shouldRedo: boolean }) => void
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>
  currentStage: number
}

export default function ActivityStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
  setCurrentStage,
  currentStage,
}: ActivityStageProps) {
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [modalVariant, setModalVariant] = useState<"success" | "warning" | "danger">("success")
  const [stageScore, setStageScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 })
  const [shouldRedoStage, setShouldRedoStage] = useState(false)

// handleStageComplete
const handleStageComplete = (correct: number, total: number) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const shouldRedo = percentage < 30;
  setShouldRedoStage(shouldRedo);
  onStageComplete({ correct, total, shouldRedo });
};

const handleCloseModal = () => {
  setShowModal(false);

  // If the score is below 30%, redo the stage (stay on the same stage)
  if (shouldRedoStage) {
    setStageScore({ correct: 0, total: 0 }); // Reset score
    setTimeout(() => {
      setCurrentStage((prev) => prev); // Triggers a re-render without changing the stage
    }, 100); // Ensure UI update happens after modal close
  } else {
    // If the stage is passed or completed with enough score, move to the next stage
    onStageComplete({ ...stageScore, shouldRedo: shouldRedoStage });
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div>
        {currentStage === 1 && (
          <ConcreteStage
            numberRange={numberRange}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
            onStageComplete={handleStageComplete}
          />
        )}

        {currentStage === 2 && (
          <FingersStage
            numberRange={numberRange}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
            onStageComplete={handleStageComplete}
          />
        )}

        {currentStage === 3 && (
          <NumbersStage
            numberRange={numberRange}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
            onStageComplete={handleStageComplete}
          />
        )}
      </div>

      {/* Modal for Stage Completion */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton className={getModalVariantClass()}>
    <Modal.Title>{modalTitle}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>{modalMessage}</p>
    <div className="score-display text-center my-3">
      <h4>
        النتيجة: {stageScore.correct} / {stageScore.total}
      </h4>
      <div className="progress">
        <div
          className={`progress-bar ${getProgressBarClass()}`}
          role="progressbar"
          style={{ width: `${stageScore.total > 0 ? (stageScore.correct / stageScore.total) * 100 : 0}%` }}
          aria-valuenow={stageScore.total > 0 ? (stageScore.correct / stageScore.total) * 100 : 0}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {stageScore.total > 0 ? Math.round((stageScore.correct / stageScore.total) * 100) : 0}%
        </div>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    {shouldRedoStage ? (
      <Button variant="danger" onClick={() => setShowModal(false)}>
        إعادة المحاولة
      </Button>
    ) : (
      <Button variant="primary" onClick={handleCloseModal}>
        متابعة
      </Button>
    )}
  </Modal.Footer>
</Modal>
    </div>
  )

  // Function to determine modal header color
  function getModalVariantClass() {
    switch (modalVariant) {
      case "success":
        return "bg-success text-white"
      case "warning":
        return "bg-warning text-dark"
      case "danger":
        return "bg-danger text-white"
      default:
        return ""
    }
  }

  // Function to determine progress bar color
  function getProgressBarClass() {
    const percentage = stageScore.total > 0 ? Math.round((stageScore.correct / stageScore.total) * 100) : 0
    if (percentage >= 70) return "bg-success"
    if (percentage >= 30) return "bg-warning"
    return "bg-danger"
  }
}

