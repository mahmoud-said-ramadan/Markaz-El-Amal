import doctorModel from "../../DB/models/Doctor.model.js";
import patientModel from "../../DB/models/Patient.model.js";
import { customAlphabet } from 'nanoid'

export const role = (url) =>{
  switch (getRolesFromUrl(url)) {
    case "doctor":
      return doctorModel;
    case "patient":
      return patientModel;
    case "admin":
     return doctorModel;
  }
}

export const getRolesFromUrl = (url) => {
  if (url.includes("doctor")) {
    return "doctor";
  } else if (url.includes("patient")) {
    return "patient";
  }
  //  else if (url.includes("admin")) {
  //   return "admin";
  // } 
};

export const code = customAlphabet("0123456789", 5)
