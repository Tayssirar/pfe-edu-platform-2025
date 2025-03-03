import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  role: string;
  userId: string;
  password: string;
  parentName?: string;
  childName?: string;
  teacherName?: string;
  school: string;
  grades: string[];
  uniqueIdentifier: string; // Add this line
}

const UserSchema: Schema = new Schema({
  role: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parentName: { type: String },
  childName: { type: String },
  teacherName: { type: String },
  school: { type: String, required: true },
  grades: { type: [String], required: true },
  uniqueIdentifier: { type: String, required: true }, // Ensure no unique constraint
});

export default mongoose.model<IUser>('User', UserSchema);