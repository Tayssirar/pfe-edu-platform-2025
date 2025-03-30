import express from "express";
import { getStudentsByTeacher, linkStudentToTeacher,
     deleteStudent, searchStudentByUniqueIdentifier,
     getChildByParent } from "../controllers/studentController";

const router = express.Router();

// Fetch students by teacher ID
router.get("/teacher/:teacherId/students", getStudentsByTeacher);

// link a student
router.post("/teacher/:teacherId/link/:uniqueIdentifier", linkStudentToTeacher);


// Delete student (unlink from teacher)
router.delete("/:teacherId/:uniqueIdentifier", deleteStudent);

// Route to search a student by unique identifier
router.get("/search/:uniqueIdentifier", searchStudentByUniqueIdentifier);

// Fetch children by parent ID
router.get("/parent/:parentId/children", getChildByParent);

export default router;
