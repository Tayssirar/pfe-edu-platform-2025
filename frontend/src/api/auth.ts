import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Login function (with real API call)
export const login = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response;
  } catch (error) {
    console.log("login error:", error);
    throw error;
  }
}

export const register = async (data: any) => {
  try {
    return await axios.post(`${API_URL}/auth/register`, data);
  } catch (error) {
    console.log("register error:", error);
    throw error;
  }
}

// Update profile photo
export const updateProfilePhoto = async (userId: string, role: string, photoUrl: string) => {
  try {
    await axios.put(`${API_URL}/auth/${role}/${userId}/photo`, { profilePhoto: photoUrl });

  } catch (error) {
    console.error("Error updating profile photo:", error);
    console.log(`${API_URL}/auth/${role}/${userId}/photo`);

    localStorage.setItem("profilePhoto", photoUrl); // Fallback in case API fails
  }
};