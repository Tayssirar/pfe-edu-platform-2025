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
  uniqueIdentifier: string;
  profilePhoto?: string; // Add this field
}

const UserSchema: Schema = new Schema({
  role: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parentName: { type: String },
  childName: { type: String },
  teacherName: { type: String },
  school: { type: String, required: true },
  grades: { type: [String], required: false },
  uniqueIdentifier: { type: String, required: true },
  profilePhoto: { type: String }, // Store image as a base64 string or URL
});

export default mongoose.model<IUser>('User', UserSchema);
