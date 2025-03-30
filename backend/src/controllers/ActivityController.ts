import Student from "../models/Student";
import { Request, Response } from "express";

// Save or update student progress
export const saveStudentProgress = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const progressData = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Append new stage data to existing stageScores
    student.progress.stageScores.push(...progressData.stageScores);

    // Update progress
    student.progress.currentStage = progressData.currentStage;
    student.progress.currentRangeMin = progressData.currentRangeMin;
    student.progress.currentRangeMax = progressData.currentRangeMax;
    student.progress.score = progressData.score;
    student.progress.totalQuestions = progressData.totalQuestions;
    student.progress.lastUpdated = new Date();

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


export const getStudentProgress = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ progress: student.progress });
  } catch (error) {
    console.error("Error retrieving student progress:", error);
    res.status(500).json({ message: "Failed to retrieve progress", error });
  }
};