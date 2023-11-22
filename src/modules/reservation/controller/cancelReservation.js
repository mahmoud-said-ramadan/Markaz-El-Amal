import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Doctor
 * logic: if status cancelled? ❎ : ✔️ Change status of reservation -> status == "booked"
 * input: reservationId
 * output: msg
 */
const cancelReservation = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.reservationId);
  const reservation = await reservationModel.findOne({
    _id: req.params.reservationId,
  });
  console.log({reservation});
  if (!reservation) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NOT_FOUND,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (reservation.status == "cancelled") {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].RESERVATION_CANCEL_BEFORE, 
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (reservation.status == "Completed") {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].RESERVATION_COMPLETE, 
        StatusCodes.BAD_REQUEST
      )
    );
  }
  reservation.status = "cancelled";
  reservation.patientId = null
  await reservation.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].RESERVATION_CANCEL, reservation });
});
export default cancelReservation;
