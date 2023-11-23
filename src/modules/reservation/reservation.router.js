import Router from "express";
import { auth } from "../../middleware/auth.js";
import reservationEndpoint from "./reservation.endPoint.js";
import makeReservation from "./controller/makeReservation.js";
import confirmReservation from "./controller/confirmReservation.js";
import {
  cancelReservationDoctor,
  cancelReservationPatient,
} from "./controller/cancelReservation.js";
import reservationNeedConfirm from "./controller/getNeedConfirmReservation.js";
const router = Router();
// Make reservation (patient)
router.patch(
  "/patient/:reservationId",
  auth(reservationEndpoint.makeReservation),
  makeReservation
);
// cancel reservation (doctor)
router.patch(
  "/doctor/:reservationId/cancel",
  auth(reservationEndpoint.cancelReservationDoctor),
  cancelReservationDoctor
);
// cancel reservation (patient)
router.patch(
  "/patient/:reservationId/cancel",
  auth(reservationEndpoint.cancelReservationPatient),
  cancelReservationPatient
);
// confirm reservation (doctor)
router.patch(
  "/doctor/:reservationId/confirm",
  auth(reservationEndpoint.confirmReservation),
  confirmReservation
);
// Get need confirm reservations (doctor)
router.get(
  "/doctor/",
  auth(reservationEndpoint.reservationNeedConfirm),
  reservationNeedConfirm
);
export default router;
