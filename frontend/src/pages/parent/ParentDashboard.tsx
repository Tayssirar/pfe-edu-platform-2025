import React, { useEffect, useState } from "react";
import { getChildByParent } from "../../api/studentList";
import { Card, Col, Row } from "react-bootstrap";

type Child = {
  _id: string;
  photo: string;
  uniqueIdentifier: string;
  childName: string;
  parentName: string;
  school: string;
  progress: {
    currentStage: number;
    currentRangeMin: number;
    currentRangeMax: number;
    score: number;
    lastUpdated: string;
  };
};

function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const parentId = user?.id; // Use optional chaining to avoid crashes

  const fetchChildren = async (parentId: string) => {
    try {
      if (!parentId) {
        console.error("No parentId found");
        return;
      }

      const childrenData = await getChildByParent(parentId);
      console.log("🚀 ~ fetchChildren ~ childrenData:", childrenData);
      setChildren(childrenData);
    } catch (error) {
      console.error("Failed to fetch children:", error);
    }
  };

  useEffect(() => {
    fetchChildren(parentId);
  }, [parentId]); // Run when parentId changes

  return (
    <div>
      {children.length > 0 ? (
        children.map((child) => (
<Row key={child._id} className="d-flex flex-column align-items-center mt-3" style={ {position: 'absolute', top: '10%',right: '25%'} }>
  {/* Child Score Card */}
  <Card className="stat-card mb-3" style={{ width: "300px" }}>
    <Card.Body className="text-center">
      <div className="stat-icon">
        <i className="bi bi-person-lines-fill" style={{ fontSize: "20px" }}></i>
      </div>
      <div className="stat-content">
        <h5>{child.progress.score}</h5>
        <p className="mb-0">التقييم العام للطفل</p>
      </div>
    </Card.Body>
  </Card>

  {/* Math Lesson Explanation */}
  <Card className="stat-card mb-2" style={{ width: "500px" }}>
    <Card.Body className="text-center">
      <div className="stat-icon">
        <i className="bi bi-calculator" style={{ fontSize: "20px" }}></i>
      </div>
      <div className="stat-content">
        <h5>تعلم الجمع من 1 إلى 50</h5>
        <p>
          يمر الطفل بثلاث مراجمع في كل نطاق رقمي، حيث يتعلم الجمع بطريقة تفاعلية من خلال ألعاب ممتعة وفيديوهات تعليمية.
        </p>
        <ul className="text-start ps-3">
          <li>🔹 المرحلة 1: فهم الأعداد والمفاهيم الأساسية</li>
          <li>🔹 المرحلة 2: تمارين وتطبيقات عملية</li>
          <li>🔹 المرحلة 3: ألعاب تفاعلية وفيديوهات تعليمية</li>
        </ul>
      </div>
    </Card.Body>
  </Card>

  {/* Child Progress Card */}
  <Card className="stat-card mb-2" style={{ width: "300px" }}>
    <Card.Body className="text-center">
      <div className="stat-icon">
        <i className="bi bi-clipboard-check" style={{ fontSize: "20px" }}></i>
      </div>
      <div className="stat-content">
        <h5>           {child.progress.currentRangeMin} - {child.progress.currentRangeMax}
        </h5>
        <p className="mb-1"> المرحلة: {child.progress.currentStage}
        </p>
        <p className="mb-1">التقييم: {child.progress.score}</p>
        <small className="text-muted">
          آخر تحديث: {new Date(child.progress.lastUpdated).toLocaleString()}
        </small>
      </div>
    </Card.Body>
  </Card>
</Row>

        ))
      ) : (
        <p>لا يوجد أطفال</p>
      )}
    </div>
  );
}

export default ParentDashboard;
