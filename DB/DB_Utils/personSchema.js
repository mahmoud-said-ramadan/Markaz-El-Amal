import { imageSchema } from "./imageSchema.js";
import { codeSchema } from "./codeSchema.js";

export const personSchema = {
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
  password: { type: String, required: true },
  phone: { type: String },
  loggedIn: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: false,
  },
  image: imageSchema,
  OTP: codeSchema,
  customId: String,
  DateOfBirth: { type: Date },
};
