import express from "express";
import { sendFeedback, getFeedbackForStudent } from "../controllers/feedbackController";

const router = express.Router();

router.post("/send", sendFeedback);
router.get("/student/:studentId", getFeedbackForStudent);

export default router;
