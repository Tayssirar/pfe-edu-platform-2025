import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import LandingPage from "./pages/LandingPage";
import TeacherDashboard from "./pages/TeacherDash";
import "bootstrap/dist/css/bootstrap.min.css";


const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacherDash" element={<TeacherDashboard />} />
        </Routes>
      </Router>
  );
};

export default App;
