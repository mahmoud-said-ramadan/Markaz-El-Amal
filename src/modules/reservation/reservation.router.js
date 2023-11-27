import Router from "express";
import { auth } from "../../middleware/auth.js";
import reservationEndpoint from "./reservation.endPoint.js";
import makeReservation from "./controller/makeReservation.js";
import confirmReservation from "./controller/confirmReservation.js";
import reservationsAllToday from "./controller/reservationsAllToday.js";
import reservationsOne from "./controller/reservationsOne.js";
import deleteReservation from "./controller/deleteReservation.js"
import {
  cancelReservationDoctor,
  cancelReservationPatient,
} from "./controller/cancelReservation.js";
import reservationNeedConfirm from "./controller/getNeedConfirmReservation.js";
const router = Router();
// Make reservation (patient)
router.patch(
  "/patient/:reservationId",
  auth(reservationEndpoint.patient),
  makeReservation
);
// cancel reservation (doctor)
router.patch(
  "/doctor/:reservationId/cancel",
  auth(reservationEndpoint.doctor),
  cancelReservationDoctor
);
// cancel reservation (patient)
router.patch(
  "/patient/:reservationId/cancel",
  auth(reservationEndpoint.patient),
  cancelReservationPatient
);
// confirm reservation (doctor)
router.patch(
  "/doctor/:reservationId/confirm",
  auth(reservationEndpoint.doctor),
  confirmReservation
);
// Get need confirm reservations (doctor)
router.get(
  "/doctor",
  auth(reservationEndpoint.doctor),
  reservationNeedConfirm
);
// Get today reservations of all doctors
router.get(
  "/today/patient",
  auth(reservationEndpoint.patient),
  reservationsAllToday
);
// Get all reservation for one doctor
router.get(
  "/patient/:doctorId",
  auth(reservationEndpoint.patient),
  reservationsOne
);
// delete reservation 
router.delete(
  "/doctor/:reservationId",
  auth(reservationEndpoint.doctor),
  deleteReservation
);
export default router;
