import axios from "axios";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const sendFeedback = async (teacherId: string, studentId: string, message: string) => {
  try {
    const response = await fetchWithRetry('post',`${API_URL}/feedback/send`, {
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
    const response = await fetchWithRetry('get',`${API_URL}/feedback/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};
