import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import activityRoutes from "./routes/activityRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";

dotenv.config();

const app = express();
app.use(cors({ origin: 'https://pfe-edu-platform-2025.vercel.app', credentials: true  }));
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
mongoose
  .connect(process.env.MONGO_URI as string, { dbName: "educ_db_pfe" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/activity", activityRoutes);
app.use ('/api/feedback', feedbackRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

