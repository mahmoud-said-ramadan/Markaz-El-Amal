import { Roles } from "../../middleware/auth.js";

 const commonEndPoint = {
  getAllUser: [Roles.admin],
  getUser: [Roles.patient, Roles.doctor ,Roles.admin],
  update: [Roles.patient, Roles.doctor],

};
export default commonEndPoint