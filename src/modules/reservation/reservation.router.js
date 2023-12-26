import Router from "express";
import { auth } from "../../middleware/auth.js";
import reservationEndpoint from "./reservation.endPoint.js";
import makeReservation from "./controller/makeReservation.js";
import confirmReservation from "./controller/confirmReservation.js";
import reservationsAllToday from "./controller/reservationsAllToday.js";
import reservationsOne from "./controller/reservationsOne.js";
import deleteReservation from "./controller/deleteReservation.js";
import {
  cancelReservationDoctor,
  cancelReservationPatient,
} from "./controller/cancelReservation.js";
import getStatusController from "./controller/common.js";
import webhook from "./controller/webhook.js";
import rejected from "./controller/rejected.js";
import booked from "./controller/booked.js";
const router = Router();
// Patient: Make reservation
router.patch(
  "/patient/:reservationId",
  auth(reservationEndpoint.patient),
  makeReservation
);
// Doctor: cancel reservation
router.patch(
  "/doctor/:reservationId/cancel",
  auth(reservationEndpoint.doctor),
  cancelReservationDoctor
);
// Patient: cancel reservation
router.patch(
  "/patient/:reservationId/cancel",
  auth(reservationEndpoint.patient),
  cancelReservationPatient
);
// Doctor: confirm reservation
router.patch(
  "/doctor/:reservationId/confirm",
  auth(reservationEndpoint.doctor),
  confirmReservation
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
// Doctor: Delete reservation
router.delete(
  "/doctor/:reservationId",
  auth(reservationEndpoint.doctor),
  deleteReservation
);

router.post("/webhook", webhook);
export default router;
