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
        categoryId: { type: Types.ObjectId, ref: "Category", required: true },
        duration: { type: Number, required: true },
      },
    ],
    avgRate: { type: Number, default: 0 },
    rateNo: { type: Number, default: 0 },
    categories: [
      {
        id: { type: Types.ObjectId, ref: "Category", required: true },
        consultationFee: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    confirm: [{ type: Types.ObjectId, ref: "Reservation", required: true }],
    accepted: [{ type: Types.ObjectId, ref: "Reservation", required: true }],
    rejected: [
      {
        reservationId: { type: Types.ObjectId, ref: "Reservation", required: false},
        patientId: { type: Types.ObjectId, ref: "Patient", required: false },
        _id: false,
      },
    ],
    completed: [{ type: Types.ObjectId, ref: "Reservation", required: true }],
  },
  {
    timestamps: true,
  }
);
const doctorModel = mongoose.models.Doctor || model("Doctor", doctorSchema);

export default doctorModel;
