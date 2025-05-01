import Student from "../models/Student"
import type { Request, Response } from "express"

// Save or update student progress
export const saveStudentProgress = async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;
  const progressData = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return; // Ensure the function returns void
    }

    // Ensure progressData.range is an array
    if (!Array.isArray(progressData.range)) {
      res.status(400).json({ message: "Invalid range data" });
      return; // Ensure the function returns void
    }

    // Handle data migration from old format (single stage) to new format (stages array)
    const migrateOldData = () => {
      if (student.progress && student.progress.range) {
        student.progress.range = student.progress.range.map((range: any) => {
          if (range.stage && !range.stages) {
            return {
              ...(range.toObject ? range.toObject() : range),
              stages: [range.stage],
            };
          }
          return range;
        });
      }
    };

    migrateOldData();

    // Update existing progress
    progressData.range.forEach((newRange: any) => {
      const existingRangeIndex = student.progress.range.findIndex((r) => r.RangeId === newRange.RangeId);

      if (existingRangeIndex !== -1) {
        const existingRange = student.progress.range[existingRangeIndex];
        if (!existingRange.stages) {
          existingRange.stages = [];
        }

        const newStages = newRange.stages || (newRange.stage ? [newRange.stage] : []);
        newStages.forEach((newStage: any) => {
          if (!newStage.stageId) return;

          const existingStageIndex = existingRange.stages.findIndex((s: any) => s.stageId === newStage.stageId);

          if (existingStageIndex !== -1) {
            const existingStage = existingRange.stages[existingStageIndex];
            existingStage.stageTotalActivity = newStage.stageTotalActivity || existingStage.stageTotalActivity || 0;
            existingStage.correctAnswer = newStage.correctAnswer || existingStage.correctAnswer || 0;
            existingStage.wrongAnswer = newStage.wrongAnswer || existingStage.wrongAnswer || 0;
            existingStage.date = newStage.date || new Date();
          } else {
            existingRange.stages.push({
              stageId: newStage.stageId,
              stageTotalActivity: newStage.stageTotalActivity || 0,
              correctAnswer: newStage.correctAnswer || 0,
              wrongAnswer: newStage.wrongAnswer || 0,
              date: newStage.date || new Date(),
            });
          }
        });

        existingRange.RangeMin = newRange.RangeMin;
        existingRange.RangeMax = newRange.RangeMax;
      } else {
        const rangeToAdd = {
          ...newRange,
          stages: newRange.stages || (newRange.stage ? [newRange.stage] : []),
        };

        if (rangeToAdd.stage) {
          delete rangeToAdd.stage;
        }

        student.progress.range.push(rangeToAdd);
      }
    });

    student.progress.currentStage = progressData.currentStage;
    student.progress.currentRangeId = progressData.currentRangeId;
    student.progress.score = progressData.score;
    student.progress.totalActivities = progressData.totalActivities;
    student.progress.lastUpdated = new Date(progressData.lastUpdated);

    await student.save();

    res.status(200).json({
      message: "Progress updated successfully",
      progress: student.progress,
    });
  } catch (error) {
    console.error("Error saving student progress:", error);
    res.status(500).json({ message: "Failed to save progress", error });
  }
};

export const getStudentProgress = async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return; // Ensure the function returns void
    }

    res.status(200).json({ progress: student.progress });
  } catch (error) {
    console.error("Error retrieving student progress:", error);
    res.status(500).json({ message: "Failed to retrieve progress", error });
  }
};
