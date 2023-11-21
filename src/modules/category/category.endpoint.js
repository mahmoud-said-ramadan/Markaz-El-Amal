import { Roles } from "../../middleware/auth.js";

 const categoryEndPoint = {
  common: [Roles.patient],
  get: [Roles.patient, Roles.doctor ,Roles.admin],
};
export default categoryEndPoint