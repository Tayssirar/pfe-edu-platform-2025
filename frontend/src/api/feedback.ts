import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/feedback";

export const sendFeedback = async (teacherId: string, studentId: string, message: string) => {
  try {
    const response = await axios.post(`${API_URL}/send`, {
      teacherId,
      studentId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};

export const getFeedbackForStudent = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};
