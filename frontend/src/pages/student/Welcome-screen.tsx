"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Row } from "react-bootstrap"
import { motion } from "framer-motion"
import { getStudentProgress } from "../../api/studentActivity"
import MathLearningActivity from "./MathLearningActivity"
import { useLocation } from "react-router-dom"

const WelcomeScreen: React.FC = () => {
  const location = useLocation()
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null")
  const studentId = user.id
  const avatar = user.avatar

  const [character, setCharacter] = useState(avatar.welcome)
  const [message, setMessage] = useState("مرحبًا بك في منصة تعلم الرياضيات! استعد للبدء!")
  const [loading, setLoading] = useState(true)
  const [studentProgress, setStudentProgress] = useState<any>(null)
  const [activityStarted, setActivityStarted] = useState(false)

  useEffect(() => {
    const fetchProgressAndId = async () => {
      try {
        const response = await getStudentProgress(studentId)
        const progress = response.progress

        console.log("🚀 ~ fetchProgressAndId ~ progress:", progress)

        // Check if this is a new student or if progress data exists
        if (!progress || !progress.range || progress.range.length === 0) {
          setMessage("مرحبًا بك في منصة تعلم الرياضيات! استعد للبدء!")
          setCharacter(avatar.welcome)
        } else {
          const stage = progress.currentStage
          const rangeId = progress.currentRangeId
          const activity = progress.totalActivities

          // Final stage + final range → completed everything
          if (stage === 3 && rangeId === 2 && activity >= 80) {
            setMessage("لقد أكملت جميع المراجمع! 🎉 أحسنت العمل 👏.")
            setCharacter(avatar.cheerful)
          } else {
            setMessage(` مرحبًا بك مرة أخرى! أنت الآن في المرحلة الأولى ${stage}  ${rangeId}. لنُكمل التعلُّم!`)
            setCharacter(avatar.welcome)
          }
        }

        setStudentProgress(progress)
      } catch (error) {
        console.error("Failed to fetch student progress:", error)
        setMessage("تعذر تحميل تقدمك. يرجى المحاولة مرة أخرى.")
        setCharacter(avatar.sad)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressAndId()
  }, [])

  const handleStart = () => {
    setActivityStarted(true)
  }

  if (loading) {
    return (
      <div className="text-center">
        <p>جارٍ تحميل تقدمك...</p>
      </div>
    )
  }

  if (activityStarted) {
    return <MathLearningActivity avatar={avatar} studentId={studentId} />
  }

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
          <img
            src={character || "/placeholder.svg"}
            alt="kid character"
            width={120}
            height={120}
            className="img-fluid"
          />
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
  )
}

export default WelcomeScreen
