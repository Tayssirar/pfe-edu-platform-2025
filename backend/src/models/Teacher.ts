import mongoose, { Schema, Document } from 'mongoose';

interface ITeacher extends Document {
  userId: string;
  uniqueIdentifier: string;
  password: string;
  teacherName: string;
  school: string;
  profilePhoto?: string;
  students: mongoose.Schema.Types.ObjectId[];  // Array of student IDs
}

const TeacherSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueIdentifier: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teacherName: { type: String, required: true },
  school: { type: String, required: true },
  profilePhoto: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Linking to students
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);