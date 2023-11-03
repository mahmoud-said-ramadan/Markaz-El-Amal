import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";
import changeEmail from "../function/changeEmail.js";

const changeEmailController = asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("patient"))
    changeEmail(patientModel)(req, res, next);
  else changeEmail(doctorModel)(req, res, next);
});

export default changeEmailController;
