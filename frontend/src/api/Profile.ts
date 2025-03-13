import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Configure axios with increased timeout for large uploads
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  maxContentLength: 10 * 1024 * 1024, // 10MB
})

// Fetch user data including profile photo
export const fetchUserData = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user data:", error)
    // Return mock data for development if API fails
    return {
      name: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").name : "",
      school: "مدرسة الأمل",
      role: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").role : "",
      uniqueIdentifier: "12345",
      profilePhoto: localStorage.getItem("profilePhoto") || null,
    }
  }
}

// Update profile photo
export const updateProfilePhoto = async (userId: string, photoData: string) => {
  try {
    const response = await apiClient.put(`/users/${userId}/profile-photo`, {
      profilePhoto: photoData,
    })
    return response.data
  } catch (error) {
    console.error("Error updating profile photo:", error)
    // For development, just store in localStorage if API fails
    localStorage.setItem("profilePhoto", photoData)
    return { success: true, message: "Profile photo updated in local storage" }
  }
}

