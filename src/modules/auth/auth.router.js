import { Router } from "express";
const router = Router();
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { asyncErrorHandler } from "../../utils/errorHandling.js";
import { preSignup , signup } from "./controller/signup.js";
import {login} from './controller/login.js'
import { confirm } from "./controller/confirm.js";
import { generateConfirmation } from "./controller/generateConfirmation.js";
import * as validators from './auth.validation.js';
import { validation } from "../../middleware/validation.js";


router.post('/:role/preSignup',validation(validators.generate),preSignup);
router.post(
  `/:role/signup`,
  fileUpload(filesValidation.image).fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  asyncErrorHandler(signup)
);
router.post('/:role/login',asyncErrorHandler(login))
router.post('/:role/confirm',validation(validators.confirm),confirm)
router.post('/:role/changeEmail/confirm',validation(validators.confirm),confirm)
router.post('/:role/password/reset',validation(validators.reset),confirm)
router.post('/:role/newConfirm',validation(validators.generate),generateConfirmation)
router.post('/:role/password/forget',validation(validators.generate),generateConfirmation)
router.post('/:role/unsubscribe',validation(validators.generate),generateConfirmation)

export default router;
