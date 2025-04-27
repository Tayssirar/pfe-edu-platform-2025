import { Request, Response } from "express";
import Student from "../models/Student";
import Parent from "../models/Parent";
import Teacher from "../models/Teacher";

// Controller to handle user login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { uniqueIdentifier, password, role } = req.body;
  try {
    let user;
    if (role === "student") {
      user = await Student.findOne({ uniqueIdentifier });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      // For demo purposes, no password check is done for students
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          role: "student",
          name: user.childName,
          school: user.school,
          uniqueIdentifier: user.uniqueIdentifier,
          avatar: user.avatar,
        },
      });
    } else if (role === "teacher") {
      user = await Teacher.findOne({ uniqueIdentifier, password });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          role: "teacher",
          name: user.teacherName,
          school: user.school,
          uniqueIdentifier: user.uniqueIdentifier,
          avatar: user.avatar,
        },
      });
    } else if (role === "parent") {
      user = await Parent.findOne({ uniqueIdentifier, password });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          role: "parent",
          name: user.parentName,
          school: user.school,
          uniqueIdentifier: user.uniqueIdentifier,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    console.error("🚀 ~ loginUser ~ error:", err); // Log any errors
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Controller to handle user registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, password, role, parentName, childName, teacherName, school, uniqueIdentifier } = req.body;
  try {
    if (role === "parent") {
      // Create parent account
      const parentUser = new Parent({
        userId: `${uniqueIdentifier}-parent`,
        password,
        parentName,
        uniqueIdentifier,
        school
      });
      await parentUser.save();

      // Create child account
      const childUser = new Student({
        userId: `${uniqueIdentifier}-student`,
        uniqueIdentifier,
        childName,
        parentName,
        school,
        parentId: parentUser._id,
        teacherId: null
      });
      await childUser.save();

      res.status(201).json({
        message: "Parent and child accounts registered successfully"
      });
    } else if (role === "teacher") {
      const newUser = new Teacher({
        userId,
        password,
        teacherName,
        school,
        uniqueIdentifier
      });
      await newUser.save();
      res.status(201).json({
        message: "Teacher registered successfully"
      });
    } 
      
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Function to update profile photo
export const updateAvatar = async (req: Request, res: Response) => {
  const { userId, role } = req.params;
  const { avatar } = req.body;

  console.log("Updating avatar for:", { userId, role, avatar }); // Debug log

  if (!avatar) {
    return res.status(400).json({ message: "الصورة الرمزية مطلوبة" });
  }

  try {
    let user;
    switch (role) {
      case "student":
        user = await Student.findOneAndUpdate({ _id: userId }, { avatar }, { new: true });
        break;
      case "teacher":
        user = await Teacher.findOneAndUpdate({ _id: userId }, { avatar }, { new: true });
        break;
      case "parent":
        user = await Parent.findOneAndUpdate({ _id: userId }, { avatar }, { new: true });
        break;
      default:
        return res.status(400).json({ message: "الدور غير صالح" });
    }

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    res.json({ message: "تم تحديث الصورة بنجاح", avatar: user.avatar });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = req.params;

  try {
    let user;
    switch (role) {
      case "student":
        user = await Student.findById(userId);
        break;
      case "teacher":
        user = await Teacher.findById(userId);
        break;
      case "parent":
        user = await Parent.findById(userId);
        break;
      default:
        res.status(400).json({ message: "Invalid role" });
        return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error", error });
  }
};