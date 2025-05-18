import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Leaderboard from "../../components/activity/Leaderboard";
import { useLocation } from "react-router-dom";
import { getStudentsByTeacher } from "../../api/studentList";

interface Student {
  id: string; // Changed to string to match the API response
  name: string;
  progress?: {
    currentStage: number;
    currentRangeMin: number;
    currentRangeMax: number;
    score: number; // Updated to use score instead of percentage
    totalQuestions: number;
    lastUpdated: string;
  };
}

const TeacherDashboard: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
  const teacherId = user._id;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async (teacherId: number) => {
      try {
        if (!teacherId) {
          console.error("No teacherId found");
          return;
        }

        const studentsData = await getStudentsByTeacher(teacherId.toString());
        console.log("Students API Response:", studentsData); // Log the response
        // Map the API response to match the expected structure
        const mappedStudents = studentsData.map((student: any) => ({
          id: student._id,
          name: student.childName,
          progress: student.progress,
        }));
        setStudents(mappedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setLoading(false);
      }
    };

    fetchStudents(teacherId);
  }, [teacherId]);

  // Sort students by score (descending)
  const sortedStudents = [...students].sort(
    (a, b) => (b.progress?.score || 0) - (a.progress?.score || 0)
  );

  return (
    <div>
      <Row className="stats-cards">
        <Col md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <i className="bi bi-person-lines-fill" style={{ fontSize: '24px' }}></i>
              </div>
              <div className="stat-content">
                <h3>{students.length}</h3>
                <p>تلميذ </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <i className="bi bi-book" style={{ fontSize: '24px' }}></i>
              </div>
              <div className="stat-content">
                <h3>1</h3>
                <p>درس </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={7} className="dashboard-leaderboard">
          <Leaderboard sortedStudents={sortedStudents} />
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;
