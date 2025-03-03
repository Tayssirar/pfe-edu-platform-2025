
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export const register = async (payload: any) => {
  try {
    const response = await axios.post(`${API_URL}/register`, payload);
    return response;
  } catch (error) {
    throw error;
  }
  
};
export const login = async (data: any) => {
  return axios.post(`${API_URL}/login`, data);
};