import { Roles } from "../../middleware/auth.js";

const reservationEndpoint = {
    patient: [Roles.user],
    doctor: [Roles.doctor],
    admin: [Roles.admin]
};
export default reservationEndpoint;
