import React, { useEffect, useState } from "react";
import { getChildByParent } from "../../api/studentList";
import StudentAchievements from "../../components/activity/Achievements";
import { getFeedbackForStudent } from "../../api/feedback";
import { Col, Spinner } from "react-bootstrap";

type Child = {
  _id: string;
  photo: string;
  uniqueIdentifier: string;
  childName: string;
  parentName: string;
  school: string;
};

type Feedback = {
  _id: string;
  message: string;
  timestamp: string;
};

function KidPerformance() {
  const [children, setChildren] = useState<Child[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [fetchingFeedback, setFetchingFeedback] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const parentId = user?._id; // Use optional chaining to avoid crashes

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

  const fetchFeedback = async (childId: string) => {
    setFetchingFeedback(true);
    try {
      const feedbacks = await getFeedbackForStudent(childId);
      setFeedbackHistory(feedbacks); // Store the fetched feedback
    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setFetchingFeedback(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchChildren(parentId); // Fetch the children when the parentId changes
    }
  }, [parentId]);

  // Ensure feedback is fetched for the selected child
  useEffect(() => {
    if (children.length > 0) {
      fetchFeedback(children[0]._id); // Fetch feedback for the first child
    }
  }, [children]);

  return (
    <div>
      {children.length > 0 ? (
        children.map((child) => (
          <div key={child._id}>
            <StudentAchievements studentId={child._id} />
          <Col lg={2} className="align-items-center text-center position-absolute" 
          style={{ top: "10%", right: "12%", background: "white" }}>
              {fetchingFeedback ? (
                <Spinner animation="border" />
              ) : feedbackHistory.length > 0 ? (
                <ul className="list-group">
                  {feedbackHistory.map((fb) => (
                    <li
                      key={fb._id}
                      className="list-group-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => alert(fb.message)} // Adjust this as needed
                    >
                      <div>
                        <span className="text-muted">الرسالة</span>
                        <i className="bi bi-text-left" style={{ marginLeft: "5px" }}></i>
                      </div>
                      <div>
                        <small className="text-muted">
                          {new Date(fb.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>لا توجد ملاحظات سابقة.</p>
              )}
          </Col>
          </div>
        ))
      ) : (
        <p>لا توجد أطفال</p>
      )}
    </div>
  );
}

export default KidPerformance;
