import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Doctor
 * logic: searh selected date to find reservations of this day if accepted reservation
 * input: date from req.body => "time": "2024-01-01"
 * output: msg ,reservation
 */
const booked = asyncErrorHandler(async (req, res, next) => {
  const time = new Date(req.body.time);
  console.log({ time });
  const booked = await reservationModel
    .find({
      doctorId: req.user._id,
      time,
      status: "confirmed",
    })
    .select("_id appointmentSeasion time patientId status")
    .populate({
      path: "patientId",
      select: "name email -_id",
    });
  return res.status(StatusCodes.OK).json({
    message: allMessages[req.query.ln].SUCCESS,
    booked,
  });
});
export default booked;
