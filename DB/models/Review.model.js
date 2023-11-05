import mongoose, { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: String,
    rate: { type: Number, default: 0, required: true },
    patientId: { type: Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Types.ObjectId, ref: "Doctor", required: true },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel;
