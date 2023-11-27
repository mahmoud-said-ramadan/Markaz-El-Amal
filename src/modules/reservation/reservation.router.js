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
import waiting from "./controller/waiting.js";
import accepted from "./controller/accepted.js";
import rejected from "./controller/rejected.js";
import completed from "./controller/completed.js";
import webhook from "./controller/webhook.js";
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
// Doctor: Get Waiting Request patients
router.get(
  "/doctor",
  auth(reservationEndpoint.doctor),
  waiting
);
// Doctor: Get Accapted patients
router.get(
  "/doctor/accepted",
  auth(reservationEndpoint.doctor),
  accepted
);
// Doctor: Get rejected patients
router.get(
  "/doctor/rejected",
  auth(reservationEndpoint.doctor),
  rejected
);
// Doctor: Get Completed patients
router.get(
  "/doctor/completed",
  auth(reservationEndpoint.doctor),
  completed
);
router.post("/webhook", webhook);
export default router;
