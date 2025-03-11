import express from "express"
import { getUserData, updateProfilePhoto } from "../controllers/userController"

const router = express.Router()

// Get user data
router.get("/:userId", getUserData)

// Update profile photo
router.put("/:userId/profile-photo", updateProfilePhoto)

export default router

