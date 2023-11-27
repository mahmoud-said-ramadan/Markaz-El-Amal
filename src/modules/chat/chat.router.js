import { Router } from 'express'
const router = Router()
import * as validators from './chat.validation.js'
import { validation } from '../../middleware/validation.js'
import chatEndPoint from './chat.endpoint.js'
import { sendMessage } from './controller/sendMessage.js'
import { getChat } from './controller/getChat.js'
import { softDeleteChat } from './controller/softDeleteChat.js'
import { auth } from '../../middleware/auth.js'

router
  .route('/:id')
  .get(auth(chatEndPoint.getChat), validation(validators.getChat), getChat)
  .patch(
    auth(chatEndPoint.deleteChat),
    validation(validators.deleteChat),
    softDeleteChat
  )

router
  .route('/')
  .post(
    auth(chatEndPoint.sendMessage),
    validation(validators.sendMessage),
    sendMessage
  )

export default router
