import chatModel from '../../../../DB/models/Chat.model.js'
import doctorModel from '../../../../DB/models/Doctor.model.js'
import patientModel from '../../../../DB/models/Patient.model.js'
import sendNotification from '../../../../sendNotifications.js'
import ErrorClass from '../../../utils/errorClass.js'
import { asyncErrorHandler } from '../../../utils/errorHandling.js'
import { allMessages } from '../../../utils/localizationHelper.js'
import { StatusCodes } from 'http-status-codes'

export const sendMessage = asyncErrorHandler(async (req, res, next) => {
    console.log('Send Message');
    const { message, id } = req.body;
  
    let isToExist;
    req.userRole === 'Doctor'
      ? (isToExist = await patientModel.findById(id))
      : (isToExist = await doctorModel.findById(id));
  
    console.log(id);
    if (!isToExist) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].INVALID_USER,
          StatusCodes.NOT_FOUND
        )
      );
    }
  
    const chatExist = await chatModel.findOne({
      $or: [
        { userOne: req.user._id, userTwo: id },
        { userOne: id, userTwo: req.user._id },
      ],
    });
  
    const newMessage = {
      from: req.user._id,
      to: id,
      content: message,
    };
  
    if (!chatExist) {
      const newChat = await chatModel.create({
        userOne: req.user._id,
        userTwo: id,
        messages: [newMessage],
      });
    sendNotification(isToExist.FCM_token, {title:'pla, pla pla plaaaa', body:'kora cover'})
      getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: newChat._id, message: newMessage, sender: req.user });
      return res.status(StatusCodes.CREATED).json({
        message: allMessages[req.query.ln].SUCCESS,
        chatId: newChat._id,
      });
    }
  
    chatExist.messages.push(newMessage);
  
    // Set dynamic refs before saving the document
    await chatExist.save();
  
    // Adjust the population based on the user role
    const populateOptions = [
      {
        path: 'messages.from',
        model: req.userRole === 'Doctor' ? 'Doctor' : 'Patient',
        select: 'name image',
      },
      {
        path: 'messages.to',
        model: req.userRole === 'Doctor' ? 'Patient' : 'Doctor',
        select: 'name image',
      },
    ];
  
    const populatedChat = await chatExist.populate(populateOptions);
    sendNotification(isToExist.FCM_token, {title:'pla, pla pla plaaaa', body:'kora cover'})
    getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: chatExist._id, message: newMessage, sender: req.user });
    return res.status(StatusCodes.CREATED).json({
      message: allMessages[req.query.ln].SUCCESS,
      chatId: populatedChat._id,
    });
  });