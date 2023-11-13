import { Roles } from "../../middleware/auth.js";

 const categoryEndPoint = {
  common: [Roles.admin],
  get: [Roles.user, Roles.doctor ,Roles.admin],
};
export default categoryEndPoint