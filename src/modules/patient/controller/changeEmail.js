import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import changeEmail from "../../../utils/handlers/changeEmail.js";
import doctorModel from "../../../../DB/models/doctor.model.js";

const changeEmailController = asyncErrorHandler((req, res, next) => {
  if (req.originalUrl.includes("patient"))
    changeEmail(patientModel)(req, res, next);
  else changeEmail(doctorModel)(req, res, next);
});

export default changeEmailController;
