import adminModel from "../../DB/models/Admin.model.js";
import doctorModel from "../../DB/models/Doctor.model.js";
import patientModel from "../../DB/models/Patient.model.js";
import { customAlphabet } from 'nanoid'

export const role = (url) =>{
  if (url.includes("doctor")) {
    return doctorModel;
  } else if(url.includes("patient")){
    return patientModel;
  } else if(url.includes("admin")){
    return adminModel;
  }
}

export const code = customAlphabet("0123456789", 5)
