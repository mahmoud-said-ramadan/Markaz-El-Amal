import Router from "express";
import { auth } from "../../middleware/auth.js";
import reservationEndpoint from "./reservation.endPoint.js";
import makeReservation from "./controller/makeReservation.js";
import confirmReservation from "./controller/confirmReservation.js";
import cancelReservation from "./controller/cancelReservation.js";
import reservationNeedConfirm from "./controller/getNeedConfirmReservation.js";
const router = Router();
router.patch(
  "/patient/:reservationId",
  auth(reservationEndpoint.makeReservation),
  makeReservation
);
router.patch(
  "/doctor/:reservationId/cancel",
  auth(reservationEndpoint.cancelReservation),
  cancelReservation
);
router.patch(
    "/doctor/:reservationId/confirm",
    auth(reservationEndpoint.confirmReservation),
    confirmReservation
  );
router.get(
    "/doctor/",
    auth(reservationEndpoint.reservationNeedConfirm),
    reservationNeedConfirm
  );
export default router;
