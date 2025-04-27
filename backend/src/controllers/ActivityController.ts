import Student from "../models/Student"
import type { Request, Response } from "express"

// Save or update student progress
export const saveStudentProgress = async (req: Request, res: Response) => {
  const { studentId } = req.params
  const progressData = req.body

  try {
    const student = await Student.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Ensure progressData.range is an array
    if (!Array.isArray(progressData.range)) {
      return res.status(400).json({ message: "Invalid range data" })
    }

    // Handle data migration from old format (single stage) to new format (stages array)
    const migrateOldData = () => {
      // Convert existing data if needed
      if (student.progress && student.progress.range) {
        student.progress.range = student.progress.range.map((range: any) => {
          // If range has 'stage' property but no 'stages' array
          if (range.stage && !range.stages) {
            return {
              ...(range.toObject ? range.toObject() : range),
              stages: [range.stage], // Convert single stage to stages array
            }
          }
          return range
        })
      }
    }

    // Migrate old data format if needed
    migrateOldData()

    // Update existing progress with proper merging of stage data
    progressData.range.forEach((newRange: any) => {
      const existingRangeIndex = student.progress.range.findIndex((r) => r.RangeId === newRange.RangeId)

      if (existingRangeIndex !== -1) {
        // Update existing range
        const existingRange = student.progress.range[existingRangeIndex]

        // Ensure ranges have stages array
        if (!existingRange.stages) {
          existingRange.stages = []
        }

        // Handle both old and new data formats in the incoming data
        const newStages = newRange.stages || (newRange.stage ? [newRange.stage] : [])

        // Process each stage in the new data
        newStages.forEach((newStage: any) => {
          if (!newStage.stageId) return // Skip invalid stages

          // Check if this stage already exists
          const existingStageIndex = existingRange.stages.findIndex((s: any) => s.stageId === newStage.stageId)

          if (existingStageIndex !== -1) {
            // Update existing stage
            const existingStage = existingRange.stages[existingStageIndex]

            // Update stage data
            existingStage.stageTotalActivity = newStage.stageTotalActivity || existingStage.stageTotalActivity || 0
            existingStage.correctAnswer = newStage.correctAnswer || existingStage.correctAnswer || 0
            existingStage.wrongAnswer = newStage.wrongAnswer || existingStage.wrongAnswer || 0
            existingStage.date = newStage.date || new Date()
          } else {
            // Add new stage
            existingRange.stages.push({
              stageId: newStage.stageId,
              stageTotalActivity: newStage.stageTotalActivity || 0,
              correctAnswer: newStage.correctAnswer || 0,
              wrongAnswer: newStage.wrongAnswer || 0,
              date: newStage.date || new Date(),
            })
          }
        })

        // Update range min/max if needed
        existingRange.RangeMin = newRange.RangeMin
        existingRange.RangeMax = newRange.RangeMax
      } else {
        // Add new range
        // Ensure it has a stages array
        const rangeToAdd = {
          ...newRange,
          stages: newRange.stages || (newRange.stage ? [newRange.stage] : []),
        }

        // Remove the old stage property if it exists
        if (rangeToAdd.stage) {
          delete rangeToAdd.stage
        }

        student.progress.range.push(rangeToAdd)
      }
    })

    // Update the rest of the progress data
    student.progress.currentStage = progressData.currentStage
    student.progress.currentRangeId = progressData.currentRangeId
    student.progress.score = progressData.score
    student.progress.totalActivities = progressData.totalActivities
    student.progress.lastUpdated = new Date(progressData.lastUpdated)

    console.log("Updating student progress:", {
      currentStage: student.progress.currentStage,
      currentRangeId: student.progress.currentRangeId,
      score: student.progress.score,
      totalActivities: student.progress.totalActivities,
      ranges: student.progress.range.map((r) => ({
        RangeId: r.RangeId,
        stages: r.stages,
      })),
    })

    await student.save()

    // Return the updated progress
    return res.status(200).json({
      message: "Progress updated successfully",
      progress: student.progress,
    })
  } catch (error) {
    console.error("Error saving student progress:", error)
    res.status(500).json({ message: "Failed to save progress", error })
  }
}

export const getStudentProgress = async (req: Request, res: Response) => {
  const { studentId } = req.params

  try {
    const student = await Student.findById(studentId)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.status(200).json({ progress: student.progress })
  } catch (error) {
    console.error("Error retrieving student progress:", error)
    res.status(500).json({ message: "Failed to retrieve progress", error })
  }
}
