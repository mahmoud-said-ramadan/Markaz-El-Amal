import chatModel from '../../../../DB/models/Chat.model.js'
import { asyncErrorHandler } from '../../../utils/errorHandling.js'
import { allMessages } from '../../../utils/localizationHelper.js'
import { StatusCodes } from 'http-status-codes'

// Endpoint to delete a message
export const softDeleteChat = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if the user is in the 'deletedBy.userId' array
    const isUserDeleted = await chatModel.findOne(
      {
        _id: id,
        'deletedBy.userId': userId
      }
    );

    if (isUserDeleted) {
      // If the user is already in the 'deletedBy.userId' array, update the 'deletedAt' field
      const updatedChat = await chatModel.findOneAndUpdate(
        {
          _id: id,
          'deletedBy.userId': userId
        },
        {
          $set: {
            'deletedBy.$.deletedAt': Date.now()
          }
        },
        {
          new: true
        }
      );

      return res
        .status(StatusCodes.ACCEPTED)
        .json({ message: allMessages[req.query.ln].SUCCESS });
    }

    // If the user is not in the 'deletedBy.userId' array, add them and set 'deletedAt'
    const updatedChat = await chatModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        $addToSet: {
          'deletedBy': {
            userId: userId,
            deletedAt: Date.now()
          }
        }
      },
      {
        new: true
      }
    );

    if (!updatedChat) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: allMessages[req.query.ln].INVALID_CHAT });
    }

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS });
  } catch (error) {
    console.error('Error:', error.message);
    return next(error);
  }
});

