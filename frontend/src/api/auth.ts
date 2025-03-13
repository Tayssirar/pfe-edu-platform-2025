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