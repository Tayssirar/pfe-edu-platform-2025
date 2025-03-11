import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import LandingPage from "./pages/LandingPage"
import TeacherDashboard from "./pages/teacher/TeacherDashboard"
import StudentDashboard from "./pages/student/StudentDashboard" 
import ParentDashboard from "./pages/parent/ParentDashboard" 
import PageLayout from "./layout/PageLayout"
import ProfilePage from "./pages/ProfilePage"

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Nested routes for different dashboard sections */}
        <Route
          path="/dashboard/:userId/teacher"
          element={
            <PageLayout>
              <TeacherDashboard />
            </PageLayout>
          }
        />
        <Route
          path="/dashboard/:userId/student"
          element={
            <PageLayout>
              <StudentDashboard />
            </PageLayout>
          }
        />
        <Route
          path="/dashboard/:userId/parent"
          element={
            <PageLayout>
              <ParentDashboard />
            </PageLayout>
          }
        />

        <Route
  path="/teacher/:userId/profile"
  element={
    <PageLayout>
      <ProfilePage />
    </PageLayout>
  }
/>


        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App

