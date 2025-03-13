import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/students";

// Fetch students specific to the logged-in teacher
export const getStudentsByTeacher = async (teacherId: string) => {
  try {
    const response = await axios.get(`${API_URL}/teacher/${teacherId}/students`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students for teacher:", error);
    throw error;
  }
};


// Link existing student to teacher
export const linkStudent = async (teacherId: string, uniqueIdentifier: string) => {
  try {
    await axios.post(`${API_URL}/teacher/${teacherId}/link/${uniqueIdentifier}`);
  } catch (error) {
    console.error("Error linking student", error);
    throw error;
  }
};


// Delete a student (unlink from teacher's list, preserve student profile)
export const deleteStudent = async (teacherId: string, uniqueIdentifier: string) => {
  try {
    await axios.delete(`${API_URL}/teacher/${teacherId}/${uniqueIdentifier}`);
  } catch (error) {
    console.error("Error deleting student", error);
    throw error;
  }
};

// Search for a student by unique identifier
export const searchStudent = async (uniqueIdentifier: string) => {
  try {
    const response = await axios.get(`${API_URL}/search/${uniqueIdentifier}`);
    return response.data;
  } catch (error) {
    console.error("Error searching for a student", error);
    throw error;
  }
};
