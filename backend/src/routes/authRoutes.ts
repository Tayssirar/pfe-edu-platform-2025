import { Router } from "express";
import { loginUser, registerUser, updateProfilePhoto } from "../controllers/authController";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
// Update profile photo
router.put("/:role/:userId/photo", updateProfilePhoto);
export default router;