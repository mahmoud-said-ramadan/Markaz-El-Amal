import mongoose, { Schema, Types, model } from "mongoose";
import { imageSchema, name } from "../DB_Utils/imageSchema.js";

const categorySchema = new Schema(
  {
    name: {
      type: Object,
      properties: {
        ar: {
          type: String,
          unique: true,
          lowercase: true,
        },
        en: {
          type: String,
          unique: true,
          lowercase: true,
        },
      },
        validate: {
          validator: function(v) {
            return Object.keys(v).length === 2 || v.ar && v.en;
          },
          message: props => `${props.value} is not a valid name object`
        },
      required: true,
      },
      slug: {
        type: Object,
        properties: {
          ar: {
            type: String,
            unique: true,
            lowercase: true,
          },
          en: {
            type: String,
            unique: true,
            lowercase: true,
          },
        },
          validate: {
            validator: function(v) {
              return Object.keys(v).length === 2 || v.ar && v.en;
            },
            message: props => `${props.value} is not a valid slug object`
          },
        required: true,
        },
    image: { type: imageSchema, required: true },
    isDeleted: { type: Boolean, default: false },
    // createdBy: { type: Types.ObjectId, ref: "Admin",}
  },
  {
    timestamps: true,
  }
);

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
