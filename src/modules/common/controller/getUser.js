import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import patientModel from "../../../../DB/models/Patient.model.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";
import getUser from "../function/getUser.js";

const getUserController =  asyncErrorHandler(async (req, res, next) => {
  if (req.originalUrl.includes("patient")){
    getUser(patientModel)(req, res, next);}
  else getUser(doctorModel)(req, res, next);
});

export default getUserController;
