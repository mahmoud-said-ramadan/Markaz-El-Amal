import mongoose , { Schema , model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";
import { codeSchema } from "../DB_Utils/codeSchema.js";

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    tempEmail: {
      type: String,
      unique: false,
      lowercase: true,
    },
    password: { type: String, required: true },
    phone: { type: String },
    loggedIn: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: false
    },
    image: imageSchema,
    OTP: codeSchema,
    customId: String,
    DateOfBirth: { type: Date },
    //------------ end shared
      history: [{
        type: String,
        date: {
            type: Date,
            required: true
          },
          required: false,
      }]
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.models.Patient || model("Patient", patientSchema);
export default patientModel;