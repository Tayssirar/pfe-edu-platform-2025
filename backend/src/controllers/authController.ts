import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// Controller to handle user login
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { uniqueIdentifier, password, role } = req.body;
  try {
    // For students, assume only uniqueIdentifier is required
    if (role === "student") {
      const user = await User.findOne({ uniqueIdentifier, role });
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
      // For demo purposes, no password check is done for students
      res.json({
        message: "Login successful",
        dashboard: `/dashboard/${user._id}`
      });
      return;
    } else {
      // For teacher and parent, check both uniqueIdentifier and password
      const user = await User.findOne({ uniqueIdentifier, role, password });
      if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }
      res.json({
        message: "Login successful",
        dashboard: `/dashboard/${user._id}`
      });
      return;
    }
  } catch (err) {
    next(err);
  }
};

// Controller to handle user registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, password, role, parentName, childName, teacherName, school, grades, uniqueIdentifier } = req.body;
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    if (role === "parent") {
      // Create parent account
      const parentUser = new User({
        userId: `${uniqueIdentifier}-parent`,
        password,
        role: "parent",
        parentName,
        childName,
        school,
        grades,
        uniqueIdentifier
      });
      await parentUser.save();

      // Create child account
      const childUser = new User({
        userId: `${uniqueIdentifier}-child`,
        password,
        role: "student",
        parentName,
        childName,
        school,
        grades,
        uniqueIdentifier
      });
      await childUser.save();

      res.status(201).json({
        message: "Parent and child accounts registered successfully",
        dashboard: `/dashboard/${parentUser._id}`
      });
    } else {
      const newUser = new User({
        userId,
        password,
        role,
        parentName: role === "parent" ? parentName : undefined,
        childName: role === "parent" ? childName : undefined,
        teacherName: role === "teacher" ? teacherName : undefined,
        school,
        grades,
        uniqueIdentifier
      });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        dashboard: `/dashboard/${newUser._id}`
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};