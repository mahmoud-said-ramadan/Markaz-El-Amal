import patientModel from "../../../../DB/models/Patient.model.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import updatePersonalInfo from "../../../utils/handlers/updatePersonalInfo.js";

const updatePersonalInfoController = asyncErrorHandler((req, res, next) => {
  if (req.originalUrl.includes("patient"))
    updatePersonalInfo(patientModel)(req, res, next);
  else updatePersonalInfo(doctorModel)(req, res, next);
});

export default updatePersonalInfoController;
