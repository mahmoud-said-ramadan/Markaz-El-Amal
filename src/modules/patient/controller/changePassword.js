import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import doctorModel from "../../../../DB/models/doctor.model.js";


const changePasswordController = asyncErrorHandler((req, res, next) => {
  if (req.originalUrl.includes("patient"))
    changePassword(patientModel)(req, res, next);
  else changePassword(doctorModel)(req, res, next);
});

export default changePasswordController;

