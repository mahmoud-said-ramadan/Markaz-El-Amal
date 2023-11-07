import mongoose, { Schema, Types, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const doctorSchema = new Schema(
  {
    ...personSchema,
    bio: {
      type: String,
      required: false,
    },
    consultationFee: {
      type: Number,
      required: false,
    },
    appointment: [
      {
          from: {           // 14
            type: Number,
            required: true,
          },              // 19
          to: {
            type: Number,
            required: true,
          },
          time: { type: Date, required: true }, // yyyy-MM-dd
        },
    ],
    duration: {         // 30 m
      type: Number,
      default: 10 
    },
    avgRate: { type: Number, default: 0 },
    rateNo: { type: Number, default: 0 },
    categories: [{
      type: Types.ObjectId,
      ref: "Category",
    }]
  },
  {
    timestamps: true,
  }
);
const doctorModel = mongoose.models.Doctor || model("Doctor", doctorSchema);

export default doctorModel;
