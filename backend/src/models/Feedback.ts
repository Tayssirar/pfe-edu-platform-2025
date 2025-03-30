import mongoose, { Schema, Document } from "mongoose";

interface IFeedback extends Document {
  teacherId: string;
  studentId: string;
  message: string;
  timestamp: Date;
}

const FeedbackSchema: Schema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
