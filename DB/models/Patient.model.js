import mongoose , { Schema, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const patientSchema = new Schema(
  {
    ...personSchema,
    history: [
      {
        doctorName: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.models.Patient || model("Patient", patientSchema);
export default patientModel;
