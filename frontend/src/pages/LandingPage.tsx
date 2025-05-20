import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import VideoPlayer from "../components/video-player"
import kidsImage from "../assets/landingPageImage.jpg"
import logo from "../assets/logo.jpg"
const LandingPage: React.FC = () => {
  const [showToast, setShowToast] = useState(false)
  const [role, setRole] = useState("")
  const navigate = useNavigate()

  const handleRoleClick = (selectedRole: string) => {
    setRole(selectedRole)
    setShowToast(true)

    // Map the Arabic role names to their English equivalents for the login page
    const roleMapping: Record<string, string> = {
      معلم: "teacher",
      ولي: "parent",
      تلميذ: "student",
    }

    // After a short delay, navigate to login with the selected role as a query parameter
    setTimeout(() => {
      navigate(`/login?role=${roleMapping[selectedRole]}`)
    }, 500)
  }

  return (
    <div className="landing-container">
      <div className="space-box teacher-space" onClick={() => handleRoleClick("معلم")}>
        <h2>فضاء المعلم</h2>
      </div>

      <div className="space-box parent-space" onClick={() => handleRoleClick("ولي")}>
        <h2>فضاء الولي</h2>
      </div>

      <div className="space-box student-space" onClick={() => handleRoleClick("تلميذ")}>
        <h2>فضاء التلميذ</h2>
      </div>
      <div className="logo-illustration">
        <img src={logo } alt="logo" />
      </div>
      <div className="video-section">
      <VideoPlayer src="https://youtu.be/vpabI9m7cFk?si=NHU8ick8mGWSmm3V" width={300} height={200} />
      </div>
      {/* 
      <div className="children-illustration">
        <img src={kidsImage || "/placeholder.svg"} alt="Children learning" />
      </div>
*/}
      {showToast && (
        <div
          className="toast show position-fixed top-0 end-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">تسجيل الدخول</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">تم اختيار {role}. سيتم توجيهك إلى صفحة الدخول...</div>
        </div>
      )}
    </div>
  )
}

export default LandingPage

