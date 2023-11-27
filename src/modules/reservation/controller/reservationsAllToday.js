import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Patient
 * logic: Get all reservations for all doctors
 * input: 
 * output: msg ,reservations
 */
const reservationsAllToday = asyncErrorHandler(async (req, res, next) => {
    const date = new Date(new Date().toISOString().slice(0, 10))
    const reservations = await reservationModel.find({
        status: "available",
        time: date
      });
      return res.status(StatusCodes.OK).json({
        message: allMessages[req.query.ln].SUCCESS,
        reservations,
      });
});
export default reservationsAllToday;
