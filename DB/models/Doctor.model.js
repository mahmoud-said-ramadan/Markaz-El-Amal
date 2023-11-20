import mongoose, { Schema, Types, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const doctorSchema = new Schema(
  {
    ...personSchema,
    bio: {
      type: String,
      required: true,
    },
    appointment: [
      {
        from: {
          // 14
          type: Number,
          required: true,
        }, // 19
        to: {
          type: Number,
          required: true,
        },
        time: { type: Date, required: true }, // yyyy-MM-dd
        id: { type: Types.ObjectId, ref: "Category" , required: true},
      },
    ],
    duration: {
      // 30 m
      type: Number,
      required: true,
    },
    avgRate: { type: Number, default: 0 },
    rateNo: { type: Number, default: 0 },
    categories: [
      {
        id: { type: Types.ObjectId, ref: "Category" , required: true},
        consultationFee: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const doctorModel = mongoose.models.Doctor || model("Doctor", doctorSchema);

export default doctorModel;
