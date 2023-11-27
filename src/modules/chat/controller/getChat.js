import chatModel from '../../../../DB/models/Chat.model.js'
import { asyncErrorHandler } from '../../../utils/errorHandling.js'
import { allMessages } from '../../../utils/localizationHelper.js'
import { StatusCodes } from 'http-status-codes'

export const getChat = asyncErrorHandler(async (req, res, next) => {
  console.log('get chat')
  const { id } = req.params
  const userId = req.user._id
  let chat
  if (id) {
    chat = await chatModel.findOne({
      $or: [
        { userOne: userId, userTwo: id },
        { userOne: id, userTwo: userId }
      ]
    })
  } else {
    chat = await chatModel.find({
      $or: [{ userOne: userId }, { userTwo: userId }]
    })
  }

  console.log('Chat:', chat)

  if (!chat) {
    // Create a new chat object if it doesn't exist
    chat = {
      userOne: userId,
      userTwo: id || userId, // Set userTwo to id if it exists, otherwise to userId
      messages: [],
      deletedBy: [] // Initialize an empty array for deletedBy
    }
  }


  // Check if the chat has been soft-deleted by the current user
  const softDeleteInfo = chat.deletedBy.find(item => item.userId.equals(userId))

  if (softDeleteInfo) {
    console.log('Soft Deleted By:', softDeleteInfo)

    // Get the date of soft deletion
    const softDeleteDate = softDeleteInfo.deletedAt

    if (softDeleteDate) {
      console.log('Soft Delete Date:', softDeleteDate)

      // If the current user has soft-deleted, filter messages sent after the soft deletion date
      if (softDeleteInfo.userId.equals(userId)) {
        chat.messages = chat.messages.filter(
          message => message.createdAt > softDeleteDate
        )
      }
    }
  }

  console.log('Final Chat:', chat)

  return res.status(StatusCodes.OK).json({
    message: allMessages[req.query.ln].SUCCESS,
    chat
  })
})