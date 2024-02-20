import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: { type: String, require: true },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      default: "onsite",
    },
    workingTime: {
      type: String,
      enum: ["part-time", "fulltime"],
      default: "fulltime",
    },
    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      default: "Junior",
    },
    jobDescription: String,

    technicalSkills: { type: Array },
    softSkills: { type: Array },
    addedBy: { type: Types.ObjectId, ref: "companyHR" },
    companyId: { type: Types.ObjectId, ref: "Company" },
  },
  {
    timestamps: true,
  }
);
export const Job = model("Job ", jobSchema);


