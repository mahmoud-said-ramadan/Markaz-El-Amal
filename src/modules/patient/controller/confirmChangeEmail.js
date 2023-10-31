import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import doctorModel from "../../../../DB/models/doctor.model.js";
import confirmChangeEmail from "../../../utils/handlers/confirmChangeEmail.js";

const confirmChangeEmailController = asyncErrorHandler((req, res, next) => {
  if (req.originalUrl.includes("patient"))
    confirmChangeEmail(patientModel)(req, res, next);
  else confirmChangeEmail(doctorModel)(req, res, next);
});

export default confirmChangeEmailController;
