interface ProgressTrackerProps {
  score: number
  totalQuestions: number
  currentStage: number
  currentRange: { min: number; max: number }
}

export default function ProgressTracker({ score, totalQuestions, currentStage, currentRange }: ProgressTrackerProps) {
  // Calculate percentage score
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <div
      className="position-absolute start-50 translate-middle-x"
      style={{
        top: 70,
        zIndex: 100,
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div
              className="score-circle d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: percentage >= 70 ? "#28a745" : percentage >= 30 ? "#ffc107" : "#dc3545",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {score}/{totalQuestions > 0 ? totalQuestions : 0}
            </div>
            <div className="ms-3">
              <h5 className="mb-0">النتيجة</h5>
              <p className="mb-0 text-muted">
                {percentage}% {percentage >= 70 ? "ممتاز!" : percentage >= 30 ? "جيد" : "استمر في المحاولة!"}
              </p>
            </div>
          </div>

          <div className="d-flex">
            <div className="ms-3 text-center">
              <div className="d-flex align-items-center justify-content-center mb-1">
                <span>المرحلة</span>
              </div>
              <div
                className="stage-badge"
                style={{
                  backgroundColor: "#e9ecef",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                {currentStage}/3
              </div>
            </div>

            <div className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-1">
                <span>الأعداد</span>
              </div>
              <div
                className="range-badge"
                style={{
                  backgroundColor: "#e9ecef",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                }}
              >
                {currentRange.min}-{currentRange.max}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

