import mongoose, { type Document, Schema } from "mongoose"

export interface IStudent extends Document {
  userId: string
  uniqueIdentifier: string
  childName: string
  school: string
  avatar: {
    profile?: string
    welcome?: string
    cheerful?: string
    sad?: string
  }
  parentName: string
  parentId: mongoose.Types.ObjectId
  teacherId?: mongoose.Types.ObjectId
  progress: {
    currentRangeId: number
    currentStage: number
    score: number
    totalActivities: number
    range: Array<{
      RangeId: number
      RangeMin: number
      RangeMax: number
      stages: Array<{
        // Changed from 'stage' to 'stages' array
        stageId?: number
        stageTotalActivity?: number
        correctAnswer?: number
        wrongAnswer?: number
        date: Date
      }>
    }>
    lastUpdated: Date
  }
}

const StudentSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  uniqueIdentifier: { type: String, required: true },
  childName: { type: String, required: true },
  school: { type: String, required: true },
  avatar: {
    profile: { type: String },
    welcome: { type: String },
    cheerful: { type: String },
    sad: { type: String },
  },
  parentName: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Parent" },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, // Linking to teacher
  progress: {
    currentStage: { type: Number, default: 1 },
    currentRangeId: { type: Number, default: 1 },
    score: { type: Number, default: 0 },
    totalActivities: { type: Number, default: 0 },
    range: [
      {
        RangeId: { type: Number },
        RangeMin: { type: Number, default: 1 },
        RangeMax: { type: Number, default: 5 },
        stages: [
          {
            // Changed from 'stage' to 'stages' array
            stageId: { type: Number },
            stageTotalActivity: { type: Number },
            correctAnswer: { type: Number },
            wrongAnswer: { type: Number },
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
})

export default mongoose.model<IStudent>("Student", StudentSchema)
