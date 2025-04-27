import React from "react";
import { useLocation} from "react-router-dom";
import { Col } from "react-bootstrap";
import StudentAchievements from "../../components/activity/Achievements";
import Feedback from "../../components/Feedback"; // Import the new Feedback component
import { Row } from "react-bootstrap";

const StudentAchievementsPage: React.FC<{}> = () => {
  const location = useLocation();
  const { student, teacherId } = location.state || {};

  if (!student) return <p>لا توجد بيانات متاحة لهذا التلميذ.</p>;

  return (
    <Row className="">
      {/* Achievements Section */}
      <Col lg={10} className="mx-auto text-center">
        <StudentAchievements studentId={student._id} />
      </Col>
      {/* Feedback Section */}
      <Col lg={2} className="align-items-center text-center position-absolute" style={{ top: "20%", left: "-6%", background: "white" }}>
        <Feedback teacherId={teacherId} studentId={student._id} />
      </Col>
    </Row>
  );
};

export default StudentAchievementsPage;
