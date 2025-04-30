"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Container, Button, Modal } from "react-bootstrap"
import ProgressTracker from "../../components/activity/Progress-tracker"
import ConcreteStage from "../../components/activity/Concrete-stage"
import FingersStage from "../../components/activity/Fingers-stage"
import NumbersStage from "../../components/activity/Numbers-stage"
import { updateStudentProgress, getStudentProgress } from "../../api/studentActivity"
import failSound from "../../assets/sounds/fail_sound.mp3"
import successSound from "../../assets/sounds/success_sound.mp3"
import confetti from "canvas-confetti"

interface Avatar {
  profile: string
  welcome: string
  cheerful: string
  sad: string
}

interface MathLearningActivityProps {
  avatar: Avatar
  studentId: string
}

interface Stage {
  stageId?: number
  stageTotalActivity?: number
  correctAnswer?: number
  wrongAnswer?: number
  date: Date
}

interface RangeData {
  RangeId: number
  RangeMin: number
  RangeMax: number
  stages: Stage[] // Change from 'stage' to 'stages' array
}

// Util function
const updateRangeAndStage = (
  updatedData: RangeData[],
  rangeId: number,
  rangeMin: number,
  rangeMax: number,
  stageId: number,
): RangeData[] => {
  let range = updatedData.find((r) => r.RangeId === rangeId)

  if (!range) {
    range = {
      RangeId: rangeId,
      RangeMin: rangeMin,
      RangeMax: rangeMax,
      stages: [
        {
          // Initialize with an array containing one stage
          stageId,
          stageTotalActivity: 0,
          correctAnswer: 0,
          wrongAnswer: 0,
          date: new Date(),
        },
      ],
    }
    updatedData.push(range)
  } else {
    // Check if stage already exists
    const stageExists = range.stages?.some((stage) => stage.stageId === stageId)

    if (!stageExists) {
      // If stages array doesn't exist, initialize it
      if (!range.stages) {
        range.stages = []
      }

      // Add new stage to the array
      range.stages.push({
        stageId,
        stageTotalActivity: 0,
        correctAnswer: 0,
        wrongAnswer: 0,
        date: new Date(),
      })
    }
  }

  return updatedData
}

const MathLearningActivity: React.FC<MathLearningActivityProps> = ({ avatar, studentId }) => {
  const [character, setCharacter] = useState(avatar.welcome)
  const [currentStage, setCurrentStage] = useState(1)
  const [currentRangeId, setCurrentRangeId] = useState(1)
  const [currentRange, setCurrentRange] = useState({ min: 1, max: 5 })
  const [score, setScore] = useState(0)
  const [totalActivities, setTotalActivities] = useState(0)
  const [stageTotalActivity, setStageTotalActivity] = useState(0)
  const [rangeData, setRangeData] = useState<RangeData[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [modalVariant, setModalVariant] = useState<"success" | "warning" | "danger">("success")
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [wrongAnswer, setWrongAnswer] = useState(0)
  const [stageChanging, setStageChanging] = useState(false) // Track stage transitions
  // Use refs to track the latest state values
  const currentStageRef = useRef(currentStage)
  const currentRangeIdRef = useRef(currentRangeId)

  // Update refs when state changes
  useEffect(() => {
    currentStageRef.current = currentStage
  }, [currentStage])

  useEffect(() => {
    currentRangeIdRef.current = currentRangeId
  }, [currentRangeId])

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { progress } = await getStudentProgress(studentId)

        if (progress) {
          setCurrentStage(progress.currentStage || 1)
          setCurrentRangeId(progress.currentRangeId || 1)
          setScore(progress.score)
          setTotalActivities(progress.totalActivities || 0)

          // Handle both old and new data structure
          const updatedRangeData = progress.range.map((r: any) => {
            // Convert old format to new format if needed
            if (r.stage && !r.stages) {
              return {
                ...r,
                stages: [r.stage], // Convert single stage to stages array
              }
            }
            return r
          })

          setRangeData(updatedRangeData || [])

          const currentRangeData = updatedRangeData.find((r: any) => r.RangeId === progress.currentRangeId)
          if (currentRangeData) {
            setCurrentRange({ min: currentRangeData.RangeMin, max: currentRangeData.RangeMax })
          }
        }
      } catch (error) {
        console.error("Failed to fetch student progress:", error)
      }
    }

    fetchProgress()
  }, [studentId])

  const saveProgress = async (updatedRangeData: RangeData[], customProgressData?: any) => {
    const progressData = customProgressData || {
      currentStage: currentStageRef.current,
      currentRangeId: currentRangeIdRef.current,
      score,
      totalActivities,
      range: updatedRangeData,
      lastUpdated: new Date().toISOString(),
    }

    try {
      setLoading(true)
      const response = await updateStudentProgress(studentId, progressData)

      if (response && response.progress) {
        // Update local state with the returned data from the server
        setScore(response.progress.score)
        setTotalActivities(response.progress.totalActivities)

        // Make sure we're using the server's version of the range data
        if (Array.isArray(response.progress.range)) {
          setRangeData(response.progress.range)
        }

        console.log("Progress saved successfully:", response.progress)
      }
    } catch (error) {
      console.error("Failed to save progress:", error)
      // Show error modal
      setModalTitle("خطأ في حفظ التقدم")
      setModalMessage("حدث خطأ أثناء حفظ تقدمك. يرجى المحاولة مرة أخرى.")
      setModalVariant("danger")
      setCharacter(avatar.sad)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }
  const generateStars = (count: number) => {
    return "⭐".repeat(count)
  }

  const handleCorrectAnswer = () => {
    const updatedData = [...rangeData]
    let currentRangeData = updatedData.find((r) => r.RangeId === currentRangeId)

    if (!currentRangeData) {
      currentRangeData = {
        RangeId: currentRangeId,
        RangeMin: currentRange.min,
        RangeMax: currentRange.max,
        stages: [
          {
            stageId: currentStage,
            stageTotalActivity: 1,
            correctAnswer: 1,
            wrongAnswer: 0,
            date: new Date(),
          },
        ],
      }
      updatedData.push(currentRangeData)
    } else {
      const currentStageData = currentRangeData.stages?.find((s) => s.stageId === currentStage)

      if (!currentStageData) {
        if (!currentRangeData.stages) {
          currentRangeData.stages = []
        }
        currentRangeData.stages.push({
          stageId: currentStage,
          stageTotalActivity: 1,
          correctAnswer: 1,
          wrongAnswer: 0,
          date: new Date(),
        })
      } else {
        currentStageData.stageTotalActivity = (currentStageData.stageTotalActivity || 0) + 1
        currentStageData.correctAnswer = (currentStageData.correctAnswer || 0) + 1
        currentStageData.date = new Date()
      }
    }

    // Update local state
    const newCorrectAnswer = correctAnswer + 1
    const newStageTotalActivity = stageTotalActivity + 1
    const newScore = score + 1
    const newTotalActivities = totalActivities + 1

    setCorrectAnswer(newCorrectAnswer)
    setStageTotalActivity(newStageTotalActivity)
    setScore(newScore)
    setTotalActivities(newTotalActivities)
    // Pass the updated values directly to saveProgress
    const progressData = {
      currentStage: currentStageRef.current,
      currentRangeId: currentRangeIdRef.current,
      score: newScore,
      totalActivities: newTotalActivities,
      range: updatedData,
      lastUpdated: new Date().toISOString(),
    }

    saveProgress(updatedData, progressData)

    new Audio(successSound).play().catch(console.error)
    confetti({ particleCount: 100, spread: 120, origin: { x: 0.5, y: 0.5 } })

    // Show success modal instead of immediately transitioning
    setModalTitle("أحسنت!")
    setModalMessage(`حصلت على نجمة جديدة \nمجموع نجومك في المرحلة ${currentStage} \n
       ${generateStars(correctAnswer + 1)}`)
    setModalVariant("success")
    setShowModal(true)
  }


  const handleWrongAnswer = () => {
    const updatedData = [...rangeData]
    let currentRangeData = updatedData.find((r) => r.RangeId === currentRangeId)

    if (!currentRangeData) {
      currentRangeData = {
        RangeId: currentRangeId,
        RangeMin: currentRange.min,
        RangeMax: currentRange.max,
        stages: [
          {
            stageId: currentStage,
            stageTotalActivity: 1,
            correctAnswer: 0,
            wrongAnswer: 1,
            date: new Date(),
          },
        ],
      }
      updatedData.push(currentRangeData)
    } else {
      const currentStageData = currentRangeData.stages?.find((s) => s.stageId === currentStage)

      if (!currentStageData) {
        if (!currentRangeData.stages) {
          currentRangeData.stages = []
        }
        currentRangeData.stages.push({
          stageId: currentStage,
          stageTotalActivity: 1,
          correctAnswer: 0,
          wrongAnswer: 1,
          date: new Date(),
        })
      } else {
        currentStageData.stageTotalActivity = (currentStageData.stageTotalActivity || 0) + 1
        currentStageData.wrongAnswer = (currentStageData.wrongAnswer || 0) + 1
        currentStageData.date = new Date()
      }
    }

    // Update local state
    const newWrongAnswer = wrongAnswer + 1
    const newStageTotalActivity = stageTotalActivity + 1
    const newTotalActivities = totalActivities + 1

    setWrongAnswer(newWrongAnswer)
    setStageTotalActivity(newStageTotalActivity)
    setTotalActivities(newTotalActivities)

    // Pass the updated values directly to saveProgress
    const progressData = {
      currentStage: currentStageRef.current,
      currentRangeId: currentRangeIdRef.current,
      score: score,
      totalActivities: newTotalActivities,
      range: updatedData,
      lastUpdated: new Date().toISOString(),
    }

    new Audio(failSound).play().catch(console.error)

    // Show failure modal instead of immediately transitioning
    setModalTitle("عذرًا!")
    setModalMessage(`إجابة خاطئة \nلم تحصل على نجمة جديدة \nمجموع نجومك في المرحلة ${currentStage}\n ${generateStars(correctAnswer)}`)
    setModalVariant("danger")
    setShowModal(true)
  }


  const handleStageComplete = async (correct: number, total: number) => {
    // Prevent multiple stage completions
    if (stageChanging) {
      console.log("Stage already changing, ignoring duplicate completion")
      return
    }

    console.log(
      "Stage complete called with stage:",
      currentStage,
      "range:",
      currentRangeId,
      "correct:",
      correct,
      "total:",
      total,
    )

    // Set flag to prevent multiple transitions
    setStageChanging(true)
    // Save the stage completion
    const updatedData = [...rangeData]
    let currentRangeData = updatedData.find((r) => r.RangeId === currentRangeId)

    if (currentRangeData) {
      const currentStageData = currentRangeData.stages.find((s) => s.stageId === currentStage)
      if (currentStageData) {
        currentStageData.correctAnswer = correct
        currentStageData.stageTotalActivity = total
        currentStageData.date = new Date()
      }
    }

    await saveProgress(updatedData)

    if (currentStage < 3) {
      setCurrentStage((prev) => {
        currentStageRef.current = prev + 1
        return prev + 1
      })
      setCorrectAnswer(0)
      setWrongAnswer(0)
      setStageTotalActivity(0)
      setCharacter(avatar.cheerful)
    } else {
      // Finished all stages in current range
      if (currentRangeId === 2 && currentStage === 3) {
        // If finished range 2 -> show message and don't move anymore
        setModalTitle("مبروك!")
        setModalMessage("لقد أكملت جميع الأنشطة! أحسنت!")
        setModalVariant("success")
        setCharacter(avatar.cheerful)
        setShowModal(true)
      } else if (currentRangeId === 1) {
        // Move to next range (only if currently at range 1)
        setCurrentRangeId((prev) => prev + 1)
        setCurrentRange({ min: 1, max: 10 })
        setCurrentStage(1)
        setCorrectAnswer(0)
        setWrongAnswer(0)
        setStageTotalActivity(0)
        setCharacter(avatar.cheerful)
      }
    }
    // Reset stage changing flag
    setTimeout(() => {
      setStageChanging(false)
    }, 1000)
  }


  const renderStageComponent = () => {
    switch (currentStage) {
      case 1:
        return (
          <ConcreteStage
            numberRange={currentRange}
            onStageComplete={handleStageComplete}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
          />
        )

      case 2:
        return (
          <FingersStage
            numberRange={currentRange}
            onStageComplete={handleStageComplete}
            onCorrectAnswer={handleCorrectAnswer}
          />
        )
      case 3:
        return (
          <NumbersStage
            numberRange={currentRange}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            onStageComplete={handleStageComplete}
          />
        )
      default:
        return <p>🎉 كل المراجمع انتهت!</p>
    }
  }

  return (
    <Container className="py-1">
      <div className="">
        <ProgressTracker
          score={score}
          totalActivities={totalActivities}
          currentStage={currentStage}
          currentRange={currentRange}
          correctAnswer={correctAnswer}
        />

        {renderStageComponent()}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={`bg-${modalVariant} text-white`}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center", fontSize: "1.5rem", whiteSpace: 'pre-line' }}>
          {modalMessage} <br />

          <img src={character || "/placeholder.svg"} alt="kid character" width={90} height={90} className="img-fluid" />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant={modalVariant} onClick={() => setShowModal(false)}>
            متابعة
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MathLearningActivity
