import express from "express";

import { saveStudentProgress, getStudentProgress } from "../controllers/ActivityController";
const router = express.Router();

// Save or update student progress
router.put("/:studentId/progress", saveStudentProgress);

// Get student progress
router.get("/:studentId/progress", getStudentProgress);

export default router;
