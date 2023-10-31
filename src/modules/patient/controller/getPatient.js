import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import getUser from "../../../utils/handlers/getUser.js";
import doctorModel from "../../../../DB/models/doctor.model.js";

const getUserController =  asyncErrorHandler((req, res, next) => {
  if (req.originalUrl.includes("patient"))
    getUser(patientModel)(req, res, next);
  else getUser(doctorModel)(req, res, next);
});

export default getUserController;
