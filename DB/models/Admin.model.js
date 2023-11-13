import mongoose , { Schema, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const adminSchema = new Schema(
  {
    ...personSchema,
  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.models.Admin || model("Admin", adminSchema);
export default adminModel;