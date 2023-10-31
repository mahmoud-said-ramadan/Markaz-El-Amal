import mongoose, { Schema, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";
import { codeSchema } from "../DB_Utils/codeSchema.js";

const doctorSchema = new mongoose.Schema(
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
    //--------- end shared
    rating: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      required: false,
    },
    consultationFee: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const doctorModel = model("Doctor", doctorSchema ) ;

export default doctorModel;// doctorSchema.methods.greet = function() {
