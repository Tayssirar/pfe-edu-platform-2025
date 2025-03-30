import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import LandingPage from "./pages/LandingPage"
import PageLayout from "./layout/PageLayout"
import ProfilePage from "./pages/ProfilePage"

import TeacherDashboard from "./pages/teacher/TeacherDashboard"
import StudentsList from "./pages/teacher/StudentsList"
import TeacherLessons from "./pages/teacher/TeacherLessons"

import StudentDashboard from "./pages/student/StudentDashboard" 
import WelcomeScreen from "./pages/student/Welcome-screen"

import ParentDashboard from "./pages/parent/ParentDashboard" 
import KidPerformance from "./pages/parent/KidPerformance"
import StudentAchievementsPage from "./pages/teacher/StudentAchievements"

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
          path="/teacher/:userId/students"
          element={
            <PageLayout>
              <StudentsList />
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
        <Route
          path="/teacher/:userId/lessons"
          element={
            <PageLayout>
              <TeacherLessons />
            </PageLayout>
          }
        />
        <Route path="/achievements/:studentId" 
          element={
            <PageLayout>
              <StudentAchievementsPage />
            </PageLayout>
          } />

        <Route
          path="/student/:userId/lessons"
          element={
            <PageLayout>
              <WelcomeScreen/>
            </PageLayout>
          }
        />
        <Route
          path="/student/:userId/profile"
          element={
            <PageLayout>
              <ProfilePage />
            </PageLayout>
          }
        />
        <Route
          path="/parent/:userId/profile"
          element={
            <PageLayout>
              <ProfilePage />
            </PageLayout>
          }
        />
                <Route
          path="/parent/:userId/kidPerformance"
          element={
            <PageLayout>
              <KidPerformance/>
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

