import { Schema, model, Types } from "mongoose";

const companySchema = new Schema(
  {
    companyName: { type: String, require: true, unique: true },
    description: String,
    industry: String,
    address: String,
    numberOfEmployees: { type: Number, min: 11, max: 20 },
    companyEmail: { type: String, unique: true, require: true },
    companyHR: { type: Types.ObjectId, ref: "User" },
    availableJobs: { type: Types.ObjectId, ref: "Job" },
  },
  {
    timestamps: true,
  }
);
export const Company = model("Company", companySchema);
