import mongoose, { Schema, Types, model } from "mongoose";

const reservationSchema = new Schema(
  {
    doctorId: { type: Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Types.ObjectId, ref: "Patient" },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    status: {
      type: String,
      enum: ["available", "pending", "cancelled", "booked"],
      default: "available",
    },
    consultationFees: {
      type: Number,
      required: true,
    },
    appointmentSeasion: {
      from: {
        type: Number,
        required: true,
      },
      to: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const reservationModel =
  mongoose.models.Reservation || model("Reservation", reservationSchema);
export default reservationModel;
