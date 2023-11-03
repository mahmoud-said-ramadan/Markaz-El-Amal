import { Roles } from "../../middleware/auth.js";

 const patientEndPoint = {
  getAllUser: [Roles.admin],
  getUser: [Roles.user, Roles.doctor ,Roles.admin],
  update: [Roles.user, Roles.doctor],

};
export default patientEndPoint