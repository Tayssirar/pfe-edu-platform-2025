import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap"
import ConcreteStage from "./Concrete-stage";
import FingersStage from "./Fingers-stage";
import NumbersStage from "./Numbers-stage";

interface ActivityStageProps {
  numberRange: { min: number; max: number };
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  onStageComplete: () => void;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>; // Add this prop
}

export default function ActivityStage({
  numberRange,
  onCorrectAnswer,
  onWrongAnswer,
  onStageComplete,
  setCurrentStage, // Destructure this prop
}: ActivityStageProps) {
  const [currentStage, setLocalCurrentStage] = useState(1);
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastTitle, setToastTitle] = useState("")
  const [toastVariant, setToastVariant] = useState<"success" | "warning" | "destructive">("success")
  const handleStageComplete = () => {
    // Move to the next stage
    if (currentStage < 3) {
      setLocalCurrentStage(currentStage + 1);
      setCurrentStage(currentStage + 1); // Update parent state
      setToastTitle("تهانينا!")
      setToastMessage(`لقد أكملت المرحلة ${currentStage}. الآن سننتقل إلى المرحلة ${currentStage + 1}`)
      setToastVariant("success")
      setShowToast(true)
    }
    // Call the onStageComplete prop if all stages are done
    if (currentStage === 3) {
      onStageComplete();
      setToastTitle("تهانينا!")
      setToastMessage("لقد أكملت جميع مراحل التعلم!")
      setToastVariant("success")
      setShowToast(true)
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
    </div>
  );
}
