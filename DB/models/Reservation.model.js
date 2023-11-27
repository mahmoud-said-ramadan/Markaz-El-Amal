import mongoose, { Schema, Types, model } from "mongoose";

const reservationSchema = new Schema(
  {
    doctorId: { type: Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Types.ObjectId, ref: "Patient" },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    status: {
      type: String,
      enum: ["available", "waiting", "pending", "cancelled", "confirmed", "booked", "Completed"],
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
      duration: { type: Number, required: true}
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
    },
    time: { type: Date, required: true }, // yyyy-MM-dd
  },
  {
    timestamps: true,
  }
);

const reservationModel =
  mongoose.models.Reservation || model("Reservation", reservationSchema);
export default reservationModel;
