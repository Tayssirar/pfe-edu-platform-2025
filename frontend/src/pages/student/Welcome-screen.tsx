import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { motion } from "framer-motion";
import kid_showing from "../../assets/kid_showing.png";
import kid_cheerful from "../../assets/kid_cheerful.png";
import kid_cartoon from "../../assets/kid_cartoon.png";
import { getStudentProgress } from "../../api/studentActivity"; // Import the API function
import MathLearningActivity from "./MathLearningActivity"; // Import the activity component

const WelcomeScreen: React.FC = () => {
  const [character, setCharacter] = useState(kid_cartoon); // Default character
  const [message, setMessage] = useState("مرحبًا بك في منصة تعلم الرياضيات! استعد للبدء!");
  const [loading, setLoading] = useState(true); // Loading state for fetching progress
  const [studentProgress, setStudentProgress] = useState<any>(null); // Store student progress
  const [studentId, setStudentId] = useState<string>("guest"); // Default student ID
  const [activityStarted, setActivityStarted] = useState(false); // Track if the activity has started

  // Fetch student progress and ID on component mount
  useEffect(() => {
    const fetchProgressAndId = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const studentId = user?.id || "guest";
        setStudentId(studentId);

        const response = await getStudentProgress(studentId);
        const progress = response.progress;
        console.log("🚀 ~ fetchProgressAndId ~ progress:", progress)
        console.log("🚀 ~ fetchProgressAndId ~ progress.currentRangeMax :", progress.currentRangeMax )

        if (progress.currentRangeMax >= 50 && progress.currentStage > 3) {
          setMessage("لقد أكملت جميع المراحل! 🎉 أحسنت العمل 👏.");
          setCharacter(kid_cheerful);
        } else if (progress.currentStage > 1 || progress.currentRangeMax > 5) {
          setMessage(`مرحبًا مرة أخرى! استمر من حيث توقفت.`);
          setCharacter(kid_showing);
        } else {
          setMessage("مرحبًا بك! استعد لبدء نشاط جديد.");
        }

        setStudentProgress(progress);
      } catch (error) {
        console.error("Failed to fetch student progress:", error);
        setMessage("تعذر تحميل تقدمك. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressAndId();
  }, []);

  const handleStart = () => {
    setActivityStarted(true);
  };


  if (loading) {
    return (
      <div className="text-center">
        <p>جارٍ تحميل تقدمك...</p>
      </div>
    );
  }

  // If the activity has started, render the MathLearningActivity component
  if (activityStarted) {
    return <MathLearningActivity studentProgress={studentProgress} studentId={studentId} />;
  }

  // Render the welcome screen
  return (
    <div>
      <Row
        className="align-items-center text-center mb-4 mb-md-0 position-absolute start-50 translate-middle"
        style={{ top: "300px" }}
      >
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
            onClick={handleStart}
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
