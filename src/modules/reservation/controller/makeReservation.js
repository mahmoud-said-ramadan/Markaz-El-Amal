import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";
/**
 * authorized: patient
 * logic: Check status of reservation if available? ❎ : ✔️ -> status == "pending" & pateintId in reservation
 * input: reservationId
 * output: msg , reservation
 */
const makeReservation = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params.reservationId  
  const reservation = await reservationModel.findOne({ _id})
  if (!reservation) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NOT_FOUND,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  if (reservation.status.toString() !== "available") {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NOT_AVAILABLE_RESERVATION,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  reservation.status = "pending"
  reservation.patientId = req.user._id
  await reservation.save()
  // push this reservation to doctor of confirm reservation
  const x = await doctorModel.findOneAndUpdate(
    { _id: reservation.doctorId },
    {
      $push: { confirmReservation: { _id } },
    },
    { new: true }
  );
  console.log({x});
  return res
  .status(StatusCodes.OK)
  .json({ message: allMessages[req.query.ln].RESERVATION_MAKE , reservation});
});
export default makeReservation;
