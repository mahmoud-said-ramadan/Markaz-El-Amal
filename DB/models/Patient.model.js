import mongoose , { Schema, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const patientSchema = new Schema(
  {
    ...personSchema,
    history: [
      {
        type: String,
        date: {
          type: Date,
          required: true,
        },
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.models.Patient || model("Patient", patientSchema);
export default patientModel;
