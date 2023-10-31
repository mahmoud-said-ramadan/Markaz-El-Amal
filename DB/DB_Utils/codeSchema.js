import { Schema } from "mongoose";

export const codeSchema = new Schema(
  {
    code: {
      type: String,
      min: [5, "Code length must be 5 character"],
      max: [5, "Code length must be 5 character"],
    },
    status: {
      type: String,
      enum: ["password", "confirm", "confirmChange", "unsubscribe"],
      required: true,
    },
    createdAt: Date,
  },
  {
    _id: false,
  }
);
