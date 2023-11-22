import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Doctor
 * logic: searh reservations of doctor to confirm
 * input: 
 * output: msg ,reservations
 */
const reservationNeedConfirm = asyncErrorHandler(async (req, res, next) => {
  return res
    .status(StatusCodes.OK)
    .json({
      message: allMessages[req.query.ln].SUCCESS,
      reservations: req.user.confirmReservation,
    });
});
export default reservationNeedConfirm;
