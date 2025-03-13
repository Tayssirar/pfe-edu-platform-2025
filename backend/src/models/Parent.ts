import mongoose, { Schema, Document } from 'mongoose';

interface IParent extends Document {
  userId: string;
  uniqueIdentifier: string;
  password: string;
  parentName: string;
  profilePhoto?: string;
  school: string;
  children: mongoose.Schema.Types.ObjectId[];  // Array of student IDs
}

const ParentSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueIdentifier: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parentName: { type: String, required: true },
  profilePhoto: { type: String },
  school: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Linking to students
});

export default mongoose.model<IParent>('Parent', ParentSchema);