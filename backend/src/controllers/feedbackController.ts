import { Request, Response } from "express";
import Feedback from "../models/Feedback";

export const sendFeedback = async (req: Request, res: Response) => {
  try {
    const { teacherId, studentId, message } = req.body;
    console.log("🚀 ~ sendFeedback ~ req.body:", req.body)
    const feedback = new Feedback({ teacherId, studentId, message });
    await feedback.save();
    res.status(201).json({ message: "Feedback sent successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: "Failed to send feedback" });
  }
};

export const getFeedbackForStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const feedbacks = await Feedback.find({ studentId }).sort({ timestamp: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
};
