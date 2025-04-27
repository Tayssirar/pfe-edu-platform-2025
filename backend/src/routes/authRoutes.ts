import { Router } from "express";
import { getUserInfo, loginUser, registerUser, updateAvatar } from "../controllers/authController";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
// Update profile photo
router.put("/:role/:userId/avatar", updateAvatar);
router.get("/:role/:userId", getUserInfo);

export default router;