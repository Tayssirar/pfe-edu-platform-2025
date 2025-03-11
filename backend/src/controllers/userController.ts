import type { Request, Response, NextFunction } from "express"
import User from "../models/User"

// Get user data
export const getUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params

  try {
    const user = await User.findOne({ userId })

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.json({
      name: user.parentName || user.childName || user.teacherName,
      school: user.school,
      role: user.role,
      uniqueIdentifier: user.uniqueIdentifier,
      profilePhoto: user.profilePhoto || null,
    })
  } catch (err) {
    next(err)
  }
}

// Update profile photo
export const updateProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params
  const { profilePhoto } = req.body

  try {
    const user = await User.findOne({ userId })

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    // Check if the profile photo is too large (over 5MB after base64 encoding)
    if (profilePhoto && profilePhoto.length > 5 * 1024 * 1024) {
      res.status(413).json({ message: "Profile photo is too large. Maximum size is 5MB." })
      return
    }

    user.profilePhoto = profilePhoto
    await user.save()

    res.json({
      success: true,
      message: "Profile photo updated successfully",
      profilePhoto: user.profilePhoto,
    })
  } catch (err) {
    next(err)
  }
}

