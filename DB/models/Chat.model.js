import mongoose, { Schema, model } from 'mongoose'

const chatSchema = new Schema(
  {
    userOne: { type: Schema.Types.ObjectId, ref: '1', required: true },
    userTwo: { type: Schema.Types.ObjectId, ref: '2', required: true },
    messages: [
      {
        from: { type: Schema.Types.ObjectId, ref: '3', required: true },
        to: { type: Schema.Types.ObjectId, ref: '4', required: true },
        content: { type: String },
        createdAt: { type: Date, default: Date.now } // Add createdAt field for each message
        // _id:false,
      }
    ],
    deletedBy: [
      {
        userId: { type: Schema.Types.ObjectId, required: true },
        deletedAt: { type: Date, required: true }, // Add deletedAt field for each soft deletion
        _id: false
      }
    ]
  },
  {
    timestamps: true
  }
)


const chatModel = mongoose.model.Chat || model('Chat', chatSchema)
export default chatModel
