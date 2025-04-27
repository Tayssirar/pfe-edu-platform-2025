// This file contains API service functions to interact with the backend
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Get student progress from the server
export async function getStudentProgress(studentId: string) {
  try {
    const response = await fetch(`${API_URL}/activity/${studentId}/progress`)

    if (!response.ok) {
      throw new Error("Failed to fetch student progress")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching student progress:", error)

  }
}

// Update student progress on the server
export async function updateStudentProgress(studentId: string, progressData: any) {
  try {
    const response = await fetch(`${API_URL}/activity/${studentId}/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressData),
    })

    if (!response.ok) {
      throw new Error("Failed to update student progress")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating student progress:", error)

    // Store progress in localStorage as a fallback if server is unavailable
    localStorage.setItem(
      `student_progress_${studentId}`,
      JSON.stringify({
        ...progressData,
        lastSyncAttempt: new Date().toISOString(),
        syncFailed: true,
      }),
    )

    return null
  }
}

// Save student progress
export async function saveStudentProgress(studentId: string, progressData: any) {
  try {
    const response = await fetch(`${API_URL}/activity/${studentId}/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressData),
    });

    if (!response.ok) {
      throw new Error("Failed to save student progress");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving student progress:", error);
    return null;
  }
}

