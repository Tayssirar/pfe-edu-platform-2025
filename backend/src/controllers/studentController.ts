import { Request, Response } from "express";
import Student from "../models/Student";

// Fetch students by teacher ID
export const getStudentsByTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;

    const students = await Student.find({ teacherId });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found for this teacher" });
    }

    return res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Error fetching students", error });
  }
};


// Add a new student and link to teacher
export const linkStudentToTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId, uniqueIdentifier } = req.params;

    // Find the student and update their teacherId
    const student = await Student.findOneAndUpdate(
      { uniqueIdentifier },
      { teacherId },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student linked successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Error linking student", error });
  }
};


// Remove student from teacher's list (unlink student from teacher)
export const deleteStudent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { teacherId, uniqueIdentifier } = req.params;
    
    // Update teacherId to null to unlink student from teacher
    const deletedStudent = await Student.findOneAndUpdate(
      { uniqueIdentifier, teacherId },
      { teacherId: null }, // Set teacherId to null to unlink
      { new: true }
    );

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting student", error });
  }
};


// Search for a student by unique identifier
export const searchStudentByUniqueIdentifier = async (req: Request, res: Response) => {
    const { uniqueIdentifier } = req.params;
  
    try {
      const student = await Student.findOne({ uniqueIdentifier });
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      return res.json(student);
    } catch (error) {
      console.error("Error searching student", error);
      return res.status(500).json({ message: "Server error" });
    }
  };