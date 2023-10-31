import Router from "express";
import patientEndPoint from "./patient.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { fileUpload, filesValidation } from "../../utils/multer.js";
import updatePersonalInfo from "./controller/updatePersonalInfo.js";
import changeEmailController from "./controller/changeEmail.js";
import changePasswordController from "./controller/changePassword.js";
import getAllUsersController from "./controller/getAllPatients.js";
import getUserController from "./controller/getPatient.js";
import logoutController from "./controller/logout.js";
import confirmChangeEmailController from "./controller/confirmChangeEmail.js";
const router = Router();

router.get("/getUser/:id", auth(patientEndPoint.getUser), getUserController);
router.get(
  "/getAllUsers",
  auth(patientEndPoint.getAllUser),
  getAllUsersController
);
router.patch(
  "/changePassword",
  auth(patientEndPoint.update),
  changePasswordController
);
router.patch(
  "/changeEmail",
  auth(patientEndPoint.update),
  changeEmailController
);
router.patch(
  "/confirmChangeEmail",
  auth(patientEndPoint.update),
  confirmChangeEmailController
);
router.patch("/logout", auth(patientEndPoint.update), logoutController);
router.put(
  "/updateInfo",
  auth(patientEndPoint.update),
  fileUpload(filesValidation.image).single("image"),
  updatePersonalInfo
);

export default router;
