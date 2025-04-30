interface ProgressTrackerProps {
  score: number
  totalActivities: number
  currentStage: number
  currentRange: { min: number; max: number }
}

export default function ProgressTracker({
  score,
  totalActivities,
  currentStage,
  currentRange,
}: ProgressTrackerProps) {
  const percentage = totalActivities && totalActivities > 0 ? Math.round((score / totalActivities) * 100) : 0

  let competenceText = ""
  if (currentRange.max <= 5) {
    competenceText = "المهارة 1: مهارة جمع الأعداد الأقل من 5"
  } else if (currentRange.max <= 10) {
    competenceText = "المهارة 2: مهارة جمع الأعداد الأقل من 10"
  }

  const filledStars = Math.round((percentage / 100) * 5)

  const baseCircleStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    fontWeight: "bold",
    fontSize: "1.4rem",
    flexDirection: "column" as const,
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  }

  return (
    <>
      {/* Right-Aligned Container */}
      <div
        className="position-absolute d-flex flex-column align-items-start"
        style={{
          right: 0,
          zIndex: 5,
          gap: "10px",
        }}
      >
        {/* Section 1: Competence */}
        <div
          className="p-3 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#ffc107",
            borderRadius: "10px",
            maxWidth: "220px",
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
          }}
        >
          <h4>{competenceText}</h4>
        </div>

        {/* Section 2: Boules */}
        <div
          className="p-3 d-flex flex-column justify-content-around align-items-center"
          style={{
            minHeight: "320px",
            gap: "10px",
          }}
        >
          {/* Stage */}
          <div style={{ ...baseCircleStyle, backgroundColor: "#577590" }}>
            <div>المرحلة</div>
            <div>{currentStage}/3</div>
          </div>

          {/* Question */}
          <div style={{ ...baseCircleStyle, backgroundColor: "#90be6d" }}>
            <div>السؤال</div>
            <div>{totalActivities}/80</div>
          </div>

          {/* Score (Stars) */}
          <div style={{ ...baseCircleStyle, backgroundColor: "#f94144" }}>
            <div>النتيجة</div>
            <div style={{ color: "#ffd700", fontSize: "1.2rem" }}>
              {"★".repeat(filledStars)}{"☆".repeat(5 - filledStars)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
