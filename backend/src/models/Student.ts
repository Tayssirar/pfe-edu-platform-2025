import mongoose, { Schema, Document } from 'mongoose';

interface IStudent extends Document {
  userId: string;
  uniqueIdentifier: string;
  childName: string;
  school: string;
  profilePhoto?: string;
  parentName: string;
  parentId: mongoose.Schema.Types.ObjectId;
  teacherId?: mongoose.Schema.Types.ObjectId; // Link to the teacher
  progress: {
    currentStage: number;
    currentRangeMin: number;
    currentRangeMax: number;
    score: number;
    totalQuestions: number;
    stageScores: Array<{
      range: string;
      stage: number;
      correct: number;
      total: number;
      date: Date;
    }>;
    lastUpdated: Date;
  };
}


const StudentSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueIdentifier: { type: String, required: true },
  childName: { type: String, required: true },
  school: { type: String, required: true },
  profilePhoto: { type: String },
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Parent' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // Linking to teacher
  progress: {
    currentStage: { type: Number, default: 1 },
    currentRangeMin: { type: Number, default: 1 },
    currentRangeMax: { type: Number, default: 5 },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    stageScores: [
      {
        range: String,
        stage: Number,
        correct: Number,
        total: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  
  
});

export default mongoose.model<IStudent>('Student', StudentSchema);