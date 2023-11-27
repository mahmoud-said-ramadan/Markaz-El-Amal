import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Patient
 * logic: Get all reservations available for one doctor
 * input:
 * output: msg ,reservations
 */
const reservationsOne = asyncErrorHandler(async (req, res, next) => {
  const reservations = await reservationModel.find({
    status: "available",
    doctorId: req.params.doctorId,
  });
  return res.status(StatusCodes.OK).json({
    message: allMessages[req.query.ln].SUCCESS,
    reservations,
  });
});
export default reservationsOne;
