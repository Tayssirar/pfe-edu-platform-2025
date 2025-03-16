import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { motion } from "framer-motion";
import kid_showing from "../../assets/kid_showing.png";
import kid_cheerful from "../../assets/kid_cheerful.png";
import kid_cartoon from "../../assets/kid_cartoon.png";

interface WelcomeScreenProps {
  onStart: () => void;
  studentProgress: {
    lastActivityCompleted: boolean;
    currentStage: number;
  };
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, studentProgress }) => {
  const [character, setCharacter] = useState(kid_cartoon); // Use a string (image path)
  const [message, setMessage] = useState("مرحبًا بك في منصة تعلم الرياضيات! استعد للبدء!");

  useEffect(() => {
    if (studentProgress) {
      if (!studentProgress.lastActivityCompleted) {
        setMessage("مرحبًا مرة أخرى! لنكمل النشاط السابق ونحاول مرة أخرى.");
        setCharacter(kid_showing); // Assign the image path directly
      } else if (studentProgress.currentStage > 1) {
        setMessage(`مرحبًا! أنت الآن في المرحلة ${studentProgress.currentStage}. استمر في العمل الجيد!`);
        setCharacter(kid_cheerful); // Assign the image path directly
      }
    }
  }, [studentProgress]);

  return (
    <div>
      <Row className="align-items-center text-center mb-4 mb-md-0 position-absolute start-50 translate-middle" 
      style={{top: "300px"}}>
        <h2>تعلم الجمع بطريقة ممتعة!</h2>
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="position-relative d-inline-block"
        >
          <img src={character} alt="kid character" width={120} height={120} className="img-fluid" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 100 }}
            className="speech-bubble position-absolute"
            style={{
              top: "0px",
              left: "-30px",
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "20px",
              maxWidth: "250px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
          >
            <p className="mb-0">{message}</p>
            <div
              className="speech-pointer"
              style={{
                position: "absolute",
                bottom: "-9px",
                right: "15px",
                width: 0,
                height: 0,
                borderTop: "10px solid #f8f9fa",
                borderRight: "10px solid transparent",
                borderLeft: "10px solid transparent",
              }}
            ></div>
          </motion.div>
        </motion.div>
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="btn btn-primary px-5 py-3 fw-bold"
          >
            هيا نبدأ!
          </motion.button>
        </div>
      </Row>
    </div>
  );
};

export default WelcomeScreen;
