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
import { validateId, validation } from "../../middleware/validation.js";
import * as validator from "./common.validation.js";
const router = Router();

// .route("/:id")
router
  .route(["/", "/:id"])
  // .get(auth(commonEndPoint.getUser), validation(validateId), getUserController)
  .put(
    auth(commonEndPoint.update),
    // fileUpload(filesValidation.image).single("image"),
    updatePersonalInfoController
  );
router.patch(
  "/changePassword",
  auth(commonEndPoint.update),
  // validation(validator.changePassword),
  changePasswordController
);
router.patch(
  "/changeEmail",
  auth(commonEndPoint.update),
  // validation(validator.changeEmail),
  changeEmailController
);
router.patch(
  "/confirmChangeEmail",
  auth(commonEndPoint.update),
  // validation(validator.confirmChangeEmail),
  confirmChangeEmailController
);
router.patch(
  "/logout",
  auth(commonEndPoint.update),
  // validation(validator.logout),
  logoutController
);

export default router;
