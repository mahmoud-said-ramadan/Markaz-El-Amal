import { Roles } from "../../middleware/auth.js";

const reservationEndpoint = {
    patient: [Roles.Patient],
    doctor: [Roles.doctor],
    admin: [Roles.admin]
};
export default reservationEndpoint;
