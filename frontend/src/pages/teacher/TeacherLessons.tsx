import React from 'react'
import { Col, Card, Button } from 'react-bootstrap'

const Teacherlessons = [
  { day: 'السبت', month: 'مارس', subject: 'رياضيات', topic: 'تعلم الجمع' },
]

function TeacherLessons() {
  return (
    <div>
        {Teacherlessons.slice(0, 3).map((lesson: { day: string; month: string; subject: string; topic: string }, index: number) => (
          <Col lg={4} style={{ position: 'absolute', left: '33.5%', top: '20%' }} >
            <Card>
            <Card.Header>
              <h5>الدروس </h5>
            </Card.Header>
            <Card.Body>
              <div className="upcoming-classes">
                {Teacherlessons.slice(0, 3).map((lesson, index) => (
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

        ))}
    </div>
  )
}

export default TeacherLessons
