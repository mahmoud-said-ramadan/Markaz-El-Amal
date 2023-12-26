import { Roles } from "../../middleware/auth.js";

 const categoryEndPoint = {
  common: [Roles.Patient],
  get: [Roles.Patient, Roles.doctor ,Roles.admin],
};
export default categoryEndPoint