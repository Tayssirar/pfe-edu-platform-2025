"use client"

import { useState, useEffect } from "react"
import { Row, Col, Table, Badge } from "react-bootstrap"
import { getStudentProgress } from "../../api/studentActivity"

interface StudentProgressProps {
  studentId: string
}

interface StageScore {
  range: string
  stageId: number
  correct: number
  total: number
  date: string
}

interface ProgressData {
  currentStage: number
  currentRangeId: number
  score: number
  totalQuestions: number
  stageData: StageScore[]
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

// Badge icons
const badgeIcons: Record<string, string> = {
  gold: "🏅",
  silver: "🥈",
  bronze: "🥉",
  participation: "🔰",
}

// Badge labels
const badgeLabels: Record<string, string> = {
  gold: "وسام ذهبي",
  silver: "وسام فضي",
  bronze: "وسام برونزي",
  participation: "شارة مشاركة",
}

export default function StudentAchievements({ studentId }: StudentProgressProps) {
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const response = await getStudentProgress(studentId)
        if (response && response.progress) {
          const data = response.progress
          const stageData: StageScore[] = []

          data.range.forEach((range: any) => {
            const rangeStr = `${range.RangeMin}-${range.RangeMax}`
            if (range.stages && Array.isArray(range.stages)) {
              range.stages.forEach((stage: any) => {
                if (stage && stage.stageId) {
                  stageData.push({
                    range: rangeStr,
                    stageId: stage.stageId,
                    correct: stage.correctAnswer || 0,
                    total: stage.stageTotalActivity || 0,
                    date: stage.date || new Date().toISOString(),
                  })
                }
              })
            } else if (range.stage) {
              stageData.push({
                range: rangeStr,
                stageId: range.stage.stageId || 0,
                correct: range.stage.correctAnswer || 0,
                total: range.stage.stageTotalActivity || 0,
                date: range.stage.date || new Date().toISOString(),
              })
            }
          })

          setProgressData({
            currentStage: data.currentStage,
            currentRangeId: data.currentRangeId,
            score: data.score,
            totalQuestions: data.totalActivities,
            stageData: stageData,
            lastUpdated: data.lastUpdated,
          })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching student progress:", error)
        setLoading(false)
      }
    }
    fetchStudentProgress()
  }, [studentId])

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return <p className="text-center text-danger">لم يتم العثور على بيانات للتقدم.</p>
  }

  const competenceText =
    progressData.currentRangeId === 1
      ? "المهارة الحالية: مهارة 1 حل الأعداد الأقل من 5"
      : "المهارة الحالية: مهارة 2 حل الأعداد الأقل من 10"

  const getRangeString = (rangeId: number) => {
    const rangeMin = (rangeId - 1) * 5 + 1
    const rangeMax = rangeId * 5
    return `${rangeMin}-${rangeMax}`
  }

  const filteredStageData1 = progressData.stageData.filter(
    (s) => s.range === getRangeString(1)
  )
  const filteredStageData2 = progressData.stageData.filter(
    (s) => s.range === getRangeString(2)
  )

  const badgeColor = {
    gold: "warning",
    silver: "primary",
    bronze: "info",
    participation: "success",
  }

  const renderTable = (data: StageScore[], title: string) => {
    const totalStages = 3; // example: 3 stages per range
    const totalQuestions = data.reduce((sum, score) => sum + score.total, 0);
    const totalCorrect = data.reduce((sum, score) => sum + score.correct, 0);
    return (
      <>
    <Table bordered hover responsive className="shadow-sm">
      <thead className="text-center bg-success text-white">
        <tr>
          <th colSpan={4} className="text-center text-primary">
            {title}
          </th>
        </tr>
        <tr>
          <th>المرحلة</th>
          <th>إجمالي الأسئلة</th>
          <th>الإجابات الصحيحة</th>
          <th>الشارة</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(totalStages)].map((_, idx) => {
          const stageId = idx + 1;
          const stageScore = data.find((s) => s.stageId === stageId);

          if (stageScore) {
            const percentage = stageScore.total > 0 ? (stageScore.correct / stageScore.total) * 100 : 0;
            const badge = getBadgeType(percentage);

            return (
              <tr key={stageId} className="text-center align-middle">
                <td className="fw-bold">{stageId}</td>
                <td>{stageScore.total}</td>
                <td>{stageScore.correct}</td>
                <td>
                  {badge ? (
                    <>
                      <div style={{ fontSize: "1.5rem" }}>{badgeIcons[badge]}</div>
                      <Badge bg={badgeColor[badge as keyof typeof badgeColor]} className="mt-2">
                        {badgeLabels[badge]}
                      </Badge>
                    </>
                  ) : (
                    <span className="text-muted">لا توجد شارة</span>
                  )}
                </td>
              </tr>
            );
          } else {
            // Stage not done yet
            return (
              <tr key={stageId} className="text-center align-middle text-muted">
                <td className="fw-bold">{stageId}</td>
                <td>0</td>
                <td>0</td>
                <td>
                  <div style={{ fontSize: "1.5rem" }}>🔒</div>
                  <div>لم يتم إنجازها</div>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
      <tfoot>
        <tr className="text-center fw-bold">
          <td>الإجمالي</td>
          <td>{totalQuestions}</td>
          <td>{totalCorrect}</td>
          <td>-</td>
        </tr>
      </tfoot>
    </Table>
      </>
    )
  }

  return (
    <div className="position-relative p-4">
      {/* Top Right Info */}
      <div className="position-absolute mt-3 start-50 translate-middle p-3 text-center bg-light shadow-sm rounded"> 
        <div className="fw-bold text-success">{competenceText}</div>
        <div className="text-secondary">المرحلة الحالية: {progressData.currentStage} من 3</div>
      </div>

      {/* Content Tables */}
      <div className="mt-5 pt-4">
        <Row>
          <Col md={6}>
            {renderTable(filteredStageData1, "المهارة 1: مهارة حل الأعداد الأقل من 5")}
          </Col>
          <Col md={6}>
            {renderTable(filteredStageData2, "المهارة 2: مهارة حل الأعداد الأقل من 10")}
          </Col>
        </Row>
      </div>
    </div>
  )
}
