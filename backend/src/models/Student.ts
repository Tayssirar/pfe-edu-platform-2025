import mongoose, { Schema, Document } from 'mongoose';

interface IStudent extends Document {
  userId: string;
  uniqueIdentifier: string;
  childName: string;
  school: string;
  profilePhoto?: string;
  parentName: string;
  parentId: mongoose.Schema.Types.ObjectId;
  teacherId?: mongoose.Schema.Types.ObjectId;  // Link to the teacher
}

const StudentSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueIdentifier: { type: String, required: true },
  childName: { type: String, required: true  },
  school: { type: String, required: true },
  profilePhoto: { type: String },
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Parent' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Linking to teacher
});

export default mongoose.model<IStudent>('Student', StudentSchema);