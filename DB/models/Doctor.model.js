import mongoose, { Schema, model } from "mongoose";
import { personSchema } from "../DB_Utils/personSchema.js";

const doctorSchema = new Schema(
  {
    ...personSchema,
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
    appointment: {
      type: Object,
      properties: {
        from: {             // 14
          type: Number,
          required: true,
        },                   // 19
        to: {
          type: Number,
          required: true,
        },
        time: [           // "time": ["{2024-01-09}" ,"{2024-01-10}"],
          {Date , required: true},
        ],
        duration: {        // 30 m
          type: Number,
          required: true
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
const doctorModel = mongoose.models.Doctor || model("Doctor", doctorSchema);

export default doctorModel;
