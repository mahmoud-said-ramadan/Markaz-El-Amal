import Router from "express";
import { auth } from "../../middleware/auth.js";
import { fileUpload, filesValidation } from "../../utils/multer.js";
import commonEndPoint from "./common.endpoint.js";
import changePasswordController from "./controller/changePassword.js";
import confirmChangeEmailController from "./controller/confirmChangeEmail.js";
import changeEmailController from "./controller/changeEmail.js";
import logoutController from "./controller/logout.js";
import updatePersonalInfoController from "./controller/updatePersonalInfo.js";
import getUserController from "./controller/getUser.js";
import { validation } from "../../middleware/validation.js";
import * as validator from "./common.validation.js";
const router = Router();

router
  .route(["/", "/:id"])
  .get(
    validation(validator.get),
    auth(commonEndPoint.getUser),
    getUserController
  )
  .put(
    fileUpload(filesValidation.image).single("image"),
    validation(validator.update),
    auth(commonEndPoint.update),
    updatePersonalInfoController
  );
router.patch(
  "/changePassword",
  validation(validator.changePassword),
  auth(commonEndPoint.update),
  changePasswordController
);
router.patch(
  "/changeEmail",
  validation(validator.changeEmail),
  auth(commonEndPoint.update),
  changeEmailController
);
router.patch(
  "/confirmChangeEmail",
  validation(validator.confirmChangeEmail),
  auth(commonEndPoint.update),
  confirmChangeEmailController
);
router.patch(
  "/logout",  
  validation(validator.logout),
  auth(commonEndPoint.update),
  logoutController
);

export default router;
