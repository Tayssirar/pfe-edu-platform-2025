import React from 'react'
import { useLocation } from 'react-router-dom'
import Achievements from '../../components/activity/Achievements'

function StudentDashboard() {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
  const studentId = user.id;

  return (
    <div>
      <Achievements studentId={studentId} />
    </div>
  )
}

export default StudentDashboard
