import { Roles } from "../../middleware/auth.js";

const reservationEndpoint = {
    makeReservation: [Roles.user],
    confirmReservation: [Roles.doctor],
    cancelReservationDoctor: [Roles.doctor],
    cancelReservationPatient: [Roles.user],
    reservationNeedConfirm: [Roles.doctor]
};
export default reservationEndpoint;
