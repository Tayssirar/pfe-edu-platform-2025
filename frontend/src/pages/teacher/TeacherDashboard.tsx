import type React from "react"
import { useState, useEffect } from "react"
import { Card, Row, Col, Table, Button } from "react-bootstrap"

const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState([])
  interface Lesson {
    day: string;
    month: string;
    subject: string;
    topic: string;
  }

  const [lessons, setLessons] = useState<Lesson[]>([])
  interface Student {
    name: string;
    points: number;
    rating: number;
  }

  const [activeStudents, setActiveStudents] = useState<Student[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, lessonsRes, activeStudentsRes] = await Promise.all([
          fetch("/api/students").then(res => res.json()),
          fetch("/api/lessons").then(res => res.json()),
          fetch("/api/active-students").then(res => res.json())
        ])

        setStudents(studentsRes)
        setLessons(lessonsRes)
        setActiveStudents(activeStudentsRes)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])


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
                <p>طالب </p>
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
                <h3>{lessons.length}</h3>
                <p>درس </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={7}>
          <Card className="dashboard-card">
            <Card.Header>
              <h5>الطلاب النشطون</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive className="student-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>النقاط </th>
                    <th>تقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStudents.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.points}</td>
                      <td>{student.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="dashboard-card">
            <Card.Header>
              <h5>الدروس </h5>
            </Card.Header>
            <Card.Body>
              <div className="upcoming-classes">
                {lessons.slice(0, 3).map((lesson, index) => (
                  <div className="class-item" key={index}>
                    <div className="class-date">
                      <span className="day">{lesson.day}</span>
                      <span className="month">{lesson.month}</span>
                    </div>
                    <div className="class-details">
                      <h3>{lesson.subject}: {lesson.topic}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline-primary" className="mt-3 w-100">
                إضافة درس جديد
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default TeacherDashboard
