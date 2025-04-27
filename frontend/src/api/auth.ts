import axios from 'axios';
import { Avatar } from '../assets/data/Avatar';

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

// Update profile avatar
export const updateAvatar = async (userId: string, role: string, avatar: Avatar) => {
  console.log("Updating avatar:", { userId, role, avatar }); // Debug log

  try {
    await axios.put(`${API_URL}/auth/${role}/${userId}/avatar`, { avatar }); // Ensure the payload is correct
  } catch (error) {
    console.error("Error updating profile avatar:", error);
    throw error; // Throw the error to handle it in the caller
  }
};

export const fetchUserInfo = async (userId: string, role: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/${role}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};
