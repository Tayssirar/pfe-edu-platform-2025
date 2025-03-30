import { useState, useEffect } from "react"
import { Card, Row, Col, Table, Badge } from "react-bootstrap"
import { getStudentProgress } from "../../api/studentActivity"
import { Award } from "react-bootstrap-icons"

interface StudentProgressProps {
  studentId: string
}

interface StageScore {
  range: string
  stage: number
  correct: number
  total: number
  date: string
}

interface ProgressData {
  currentStage: number
  currentRangeMin: number
  currentRangeMax: number
  score: number
  totalQuestions: number
  stageScores: StageScore[]
  lastUpdated: string
}

// Badge types
const getBadgeType = (percentage: number) => {
  if (percentage >= 90) return "gold"
  if (percentage >= 70) return "silver"
  if (percentage >= 50) return "bronze"
  if (percentage > 0) return "participation"
  return ""
}

// Badge emojis
const badgeIcons: Record<string, string> = {
  gold: "🏅",
  silver: "🥈",
  bronze: "🥉",
  participation: "🔰"
}

// Badge label
const badgeLabels: Record<string, string> = {
  gold: "وسام ذهبي",
  silver: "وسام فضي",
  bronze: "وسام برونزي",
  participation: "شارة مشاركة"
}

export default function StudentAchievements({ studentId }: StudentProgressProps) {
  const [studentProgress, setStudentProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const response = await getStudentProgress(studentId)
        const data = response.progress
        setStudentProgress(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching student progress:", error)
        setLoading(false)
      }
    }
    fetchStudentProgress()
  }, [studentId])

  // Calculate progress bar percentage
  const calculateProgress = (score: number, totalQuestions: number) => {
    return totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
  }

  // Get total score
  const getTotalScore = () => {
    if (!studentProgress?.stageScores) return 0
    return studentProgress.stageScores.reduce((acc, score) => acc + score.correct, 0)
  }

  // Get total questions
  const getTotalQuestions = () => {
    if (!studentProgress?.stageScores) return 0
    return studentProgress.stageScores.reduce((acc, score) => acc + score.total, 0)
  }

  const totalScore = getTotalScore()
  const totalQuestions = getTotalQuestions()
  const percentage = calculateProgress(totalScore, totalQuestions)
  const badgeType = getBadgeType(percentage)

  return (
    <div>
      <Col lg={4} className="align-items-center text-center position-absolute width-100"
        style={{ top: "80px", left: "33.5%" }}>
        
        {/* Badge */}
        <div style={{
          position: "absolute",
          top: "60%",
          left: "-22%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          background: "white",
          padding: "10px",
          borderRadius: "30%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
        }}>
          <h1 style={{ fontSize: "70px" }}>{badgeIcons[badgeType]}</h1>
          <Badge bg="primary">{badgeLabels[badgeType]}</Badge>
        </div>

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0 text-end">
              <Award size={20} className="me-2" />
              الإنجازات والشارات
            </h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">جاري التحميل...</span>
                </div>
              </div>
            ) : (
              <>
                {studentProgress ? (
                  <>
                    <div className="child-stats text-end">
                      <h5> درس الجمع</h5>
                      <Row className="mb-2">
                        <Col>
                          النطاق العددي {studentProgress.currentRangeMin} من {studentProgress.currentRangeMax}
                        </Col>
                        <Col>المرحلة الحالية {studentProgress.currentStage} من 3</Col>
                      </Row>

                      <div>
                        <p className="mb-1">
                          النتيجة الإجمالية {percentage.toFixed(2)}%
                        </p>
                        <div className="progress mb-2">
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={studentProgress.score}
                            aria-valuemin={0}
                            aria-valuemax={studentProgress.totalQuestions}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <Table bordered hover className="mt-3">
                      <thead>
                        <tr className="text-center">
                          <th>النطاق</th>
                          <th>المرحلة</th>
                          <th>عدد الإجابات الصحيحة</th>
                          <th>إجمالي الأسئلة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentProgress.stageScores && studentProgress.stageScores.length > 0 ? (
                          studentProgress.stageScores.map((score, index) => (
                            <tr key={index} className="text-center">
                              <td>{score.range}</td>
                              <td>{score.stage}</td>
                              <td>{score.correct}</td>
                              <td>{score.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center text-muted">
                              لم يتم تسجيل أي بيانات حتى الآن
                            </td>
                          </tr>
                        )}
                        <tr className="fw-bold text-center">
                          <td colSpan={2}>الإجمالي</td>
                          <td>{totalScore}</td>
                          <td>{totalQuestions}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <p>لم يتم العثور على بيانات للتقدم.</p>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </div>
  )
}
