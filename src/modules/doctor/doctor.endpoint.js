import { Roles } from "../../middleware/auth.js";

const doctorEndpoint = {
  modifyDate: Roles.doctor,
};
export default doctorEndpoint;
