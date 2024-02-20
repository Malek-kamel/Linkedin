import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    recoveryEmail: { type: String, require: true },

    DOB: { type: Date },
    mobileNumber: { type: String, unique: true, require: true },
    role: {
      type: String,
      enum: ["User", "Company_HR"],
      default: "User",
    },
    logout: { type: Boolean, default: true },
    isConfirmed: { type: Boolean, default: false },

    forgetCode: String,
  },
  {
    timestamps: true,
  }
);
export const User = model("User", userSchema);
