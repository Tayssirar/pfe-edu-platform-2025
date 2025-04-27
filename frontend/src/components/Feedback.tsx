import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { sendFeedback, getFeedbackForStudent } from "../api/feedback";

type FeedbackProps = {
  teacherId: string;
  studentId: string;
};

type Feedback = {
  _id: string;
  message: string;
  timestamp: string;
};

const Feedback: React.FC<FeedbackProps> = ({ teacherId, studentId }) => {
  const [feedback, setFeedback] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFeedback, setFetchingFeedback] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [studentId]);

  const fetchFeedback = async () => {
    setFetchingFeedback(true);
    try {
      const feedbacks = await getFeedbackForStudent(studentId);
      setFeedbackHistory(feedbacks);
    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setFetchingFeedback(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      await sendFeedback(teacherId, studentId, feedback);
      setFeedback(""); // Clear input after sending
      fetchFeedback(); // Refresh feedback list
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("Error sending feedback", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div >
      <h4>الملاحظات السابقة</h4>
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
                <i className="bi bi-text-left" ></i>
              </div>
              <div>
                <small className="text-muted">{new Date(fb.timestamp).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد ملاحظات سابقة.</p>
      )}

      {/* Button to Open Feedback Modal */}
      <Button variant="primary" className="mt-2" onClick={() => setShowFeedbackModal(true)}>
        أرسل ملاحظات
        <br/>
         إلى الولي
      </Button>
      </div>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إرسال ملاحظات</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>اكتب الملاحظات التي تريد إرسالها إلى ولي الأمر</p>
          <textarea
            className="form-control"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="أدخل الملاحظات هنا..."
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            إغلاق
          </Button>
          <Button variant="success" onClick={handleSendFeedback} disabled={loading}>
            {loading ? "جارٍ الإرسال..." : "إرسال"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Feedback;
