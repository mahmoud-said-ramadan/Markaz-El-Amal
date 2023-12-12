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
import accepted from "./controller/accepted.js";
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
// Doctor: Get Accapted patients
router.get(
  "/doctor/accepted",
  auth(reservationEndpoint.doctor),
  getStatusController
);
// Doctor: Get rejected patients
router.get("/doctor/rejected", auth(reservationEndpoint.doctor), rejected);
// Doctor: Get Waiting Request patients
router.get(
  "/doctor/waiting",
  auth(reservationEndpoint.doctor),
  getStatusController
);
// Doctor: Get confirm patients
router.get(
  "/doctor/confirm",
  auth(reservationEndpoint.doctor),
  getStatusController
);
// Doctor: Get confirm patients of selected date in req.body
router.get("/doctor/booked", auth(reservationEndpoint.doctor), booked);
router.post("/webhook", webhook);
export default router;
