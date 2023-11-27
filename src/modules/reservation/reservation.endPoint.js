import { Roles } from "../../middleware/auth.js";

const reservationEndpoint = {
    makeReservation: [Roles.Patient],
    confirmReservation: [Roles.doctor],
    cancelReservation: [Roles.doctor],
    reservationNeedConfirm: [Roles.doctor]
};
export default reservationEndpoint;
