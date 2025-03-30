import React from "react";
import { useLocation} from "react-router-dom";
import { Col } from "react-bootstrap";
import StudentAchievements from "../../components/activity/Achievements";
import Feedback from "../../components/Feedback"; // Import the new Feedback component

const StudentAchievementsPage: React.FC<{}> = () => {
  const location = useLocation();
  const { student, teacherId } = location.state || {};

  if (!student) return <p>لا توجد بيانات متاحة لهذا التلميذ.</p>;

  return (
    <div className="container mt-4">
      <Col style={{ background: "white" }} lg={2}>
        <h2>إنجازات {student.childName}</h2>
        <img src={student.profilePhoto} alt="Student" style={{ width: "100px", borderRadius: "50%" }} />
        <p><strong>المعرف الفريد:</strong> {student.uniqueIdentifier}</p>
        <p><strong>اسم الطفل:</strong> {student.childName}</p>
        <p><strong>اسم الوالد:</strong> {student.parentName}</p>
        <p><strong>المدرسة:</strong> {student.school}</p>
      </Col>

      {/* Achievements Section */}
      <StudentAchievements studentId={student._id} />

      {/* Feedback Section */}
      <Col lg={2} className="align-items-center text-center position-absolute" style={{ top: "23%", left: "1%", background: "white" }}>
        <Feedback teacherId={teacherId} studentId={student._id} />
      </Col>
    </div>
  );
};

export default StudentAchievementsPage;
