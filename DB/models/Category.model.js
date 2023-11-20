import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema } from "../DB_Utils/imageSchema.js";

const categorySchema = new Schema(
  {
    name: {
        ar: {
          type: String,
          unique: true,
          lowercase: true,
          required: true,
        },
        en: {
          type: String,
          unique: true,
          lowercase: true,
          required: true,
        },
      },
      slug: {
          ar: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
          },
          en: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
          },
        },
    image: { type: imageSchema, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: "Admin"},
    customId: { type: String },
  },
  {
    timestamps: true,
  }
);

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
