import { Roles } from "../../middleware/auth.js";

 const patientEndPoint = {
  getAllUser: [Roles.admin],
  getUser: [Roles.Patient, Roles.doctor ,Roles.admin],
  update: [Roles.Patient, Roles.doctor],

};
export default patientEndPoint