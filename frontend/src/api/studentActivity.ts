// This file contains API service functions to interact with the backend

// Get student progress from the server
export async function getStudentProgress(studentId: string) {
    try {
      const response = await fetch(`/api/students/${studentId}/progress`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch student progress")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching student progress:", error)
  
      // Return default progress for demo purposes
      return {
        currentStage: 1,
        currentRangeMin: 1,
        currentRangeMax: 5,
        lastScore: 0,
        lastActivityCompleted: true,
      }
    }
  }
  
  // Update student progress on the server
  export async function updateStudentProgress(studentId: string, progressData: any) {
    try {
      const response = await fetch(`/api/students/${studentId}/progress`, {
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
      return null
    }
  }
  
  // Get leaderboard data
  export async function getLeaderboard() {
    try {
      const response = await fetch("/api/leaderboard")
  
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
  
      // Return mock leaderboard data for demo purposes
      return [
        { id: "student1", name: "أحمد", score: 95, badge: "gold" },
        { id: "student2", name: "سارة", score: 90, badge: "gold" },
        { id: "student3", name: "محمد", score: 85, badge: "silver" },
        { id: "student4", name: "فاطمة", score: 80, badge: "silver" },
        { id: "student5", name: "عمر", score: 75, badge: "bronze" },
      ]
    }
  }
  
  // Get student badges and achievements
  export async function getStudentAchievements(studentId: string) {
    try {
      const response = await fetch(`/api/students/${studentId}/achievements`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch student achievements")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching student achievements:", error)
  
      // Return mock achievements data for demo purposes
      return [
        { id: "badge1", name: "بطل الجمع", description: "أكمل 10 عمليات جمع بنجاح", date: "2023-05-15" },
        { id: "badge2", name: "متعلم سريع", description: "أكمل المرحلة الأولى في أقل من 5 دقائق", date: "2023-05-16" },
        { id: "badge3", name: "خبير الأرقام", description: "أكمل المرحلة الثالثة بنجاح", date: "2023-05-20" },
      ]
    }
  }
  
  