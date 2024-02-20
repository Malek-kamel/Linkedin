import { Schema, model, Types } from "mongoose";

const ApplicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job" },
    userId: { type: Types.ObjectId, ref: "User" },
    userTechSkills: { type: Array },
    userSoftSkills: { type: Array },
    userResume: { secure_url: String, public_id: String },
  },
  {
    timestamps: true,
  }
);
export const Application = model("Application", ApplicationSchema);
