import { Request, Response } from "express";
import Student from "../models/Student";

// Fetch students by teacher ID
export const getStudentsByTeacher = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { teacherId } = req.params;

    const students = await Student.find({ teacherId });

    if (!students || students.length === 0) {
      res.status(404).json({ message: "No students found for this teacher" });
      return;
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students", error });
    return;
  }
};


// Add a new student and link to teacher
export const linkStudentToTeacher = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { teacherId, uniqueIdentifier } = req.params;

    // Find the student and update their teacherId
    const student = await Student.findOneAndUpdate(
      { uniqueIdentifier },
      { teacherId },
      { new: true }
    );

    if (!student) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

     res.json({ message: "Student linked successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error linking student", error });
  }
};


// Remove student from teacher's list (unlink student from teacher)
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId, uniqueIdentifier } = req.params;

    // Update teacherId to null to unlink student from teacher
    const deletedStudent = await Student.findOneAndUpdate(
      { uniqueIdentifier, teacherId },
      { teacherId: null },
      { new: true }
    );

    if (!deletedStudent) {
      res.status(404).json({ message: "Student not found" });
      return; // Ensure the function returns void
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};


// Search for a student by unique identifier
export const searchStudentByUniqueIdentifier = async (req: Request, res: Response): Promise<void>  => {
    const { uniqueIdentifier } = req.params;
  
    try {
      const student = await Student.findOne({ uniqueIdentifier });
  
      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }
  
      res.json(student);
    } catch (error) {
      console.error("Error searching student", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Fetch child by parent ID
export const getChildByParent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parentId } = req.params;

    const students = await Student.find({ parentId });

    if (!students || students.length === 0) {
      res.status(404).json({ message: "No child found for this parent" });
      return; // Ensure the function returns void
    }

    res.json(students);
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Error fetching children", error });
  }
};

// Find students by school who are NOT linked to any teacher yet
export const getUnlinkedStudentsBySchool = async (req: Request, res: Response) : Promise<void>=> {
  try {
    const { school } = req.params;

    const students = await Student.find({ 
      school, 
      teacherId: { $in: [null, undefined] } // Match unlinked students (teacherId is either null or does not exist)
    });

    res.json(students);
    return;
  } catch (error) {
    console.error("Error fetching unlinked students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

