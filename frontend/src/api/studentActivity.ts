import { fetchWithRetry } from "../utils/fetchWithRetry";

// This file contains API service functions to interact with the backend
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get student progress from the server
export async function getStudentProgress(studentId: string) {
  try {
    const response = await fetchWithRetry('get', `${API_URL}/activity/${studentId}/progress`);

    if (!response.status || response.status >= 400) {
      throw new Error("Failed to fetch student progress");
    }

    return response.data; // Axios responses use `data` for the response body
  } catch (error) {
    console.error("Error fetching student progress:", error);
    return null;
  }
}

// Update student progress on the server
export async function updateStudentProgress(studentId: string, progressData: any) {
  try {
    const response = await fetchWithRetry('put', `${API_URL}/activity/${studentId}/progress`, progressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.status || response.status >= 400) {
      throw new Error("Failed to update student progress");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating student progress:", error);

    // Store progress in localStorage as a fallback if server is unavailable
    localStorage.setItem(
      `student_progress_${studentId}`,
      JSON.stringify({
        ...progressData,
        lastSyncAttempt: new Date().toISOString(),
        syncFailed: true,
      }),
    );

    return null;
  }
}

// Save student progress
export async function saveStudentProgress(studentId: string, progressData: any) {
  try {
    const response = await fetchWithRetry('put', `${API_URL}/activity/${studentId}/progress`, progressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.status || response.status >= 400) {
      throw new Error("Failed to save student progress");
    }

    return response.data;
  } catch (error) {
    console.error("Error saving student progress:", error);
    return null;
  }
}

