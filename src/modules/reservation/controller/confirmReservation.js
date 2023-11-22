import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
import patientModel from "../../../../DB/models/Patient.model.js";
/**
 * authorized: Doctor
 * logic: if confirmed? ✔️ : ❎ Change status of reservation -> status == "confirmed" & push this reservation to history of patient
 * input: reservationId
 * output: msg , reservation
 */
const confirmReservation = asyncErrorHandler(async (req, res, next) => {
  const reservation = await reservationModel.findOne({
    _id: req.params.reservationId,
  });
  if (!reservation) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NOT_FOUND,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (reservation.status == "confirmed") {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].RESERVATION_CONFIRM_BEFORE,
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
  reservation.status = "confirmed";
  await reservation.save()
  // push this reservation to history of patient
  await patientModel.findOneAndUpdate(
    { _id: reservation.patientId },
    {
      $push: { history: { doctorName: req.user.name, date: reservation.time } },
    },
    { new: true }
  );
  return res.status(StatusCodes.ACCEPTED).json({
    message: allMessages[req.query.ln].RESERVATION_CONFIRM,
    reservation
  });
});
export default confirmReservation;
