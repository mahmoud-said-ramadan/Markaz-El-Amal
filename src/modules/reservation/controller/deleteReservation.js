import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reservationModel from "../../../../DB/models/Reservation.model.js";
/**
 * authorized: Doctor
 * logic: When can delete? if status available? ✔️ : ❎ 
 * input: reservationId
 * output: msg and deleted reservation
 */
 const deleteReservation = asyncErrorHandler(
  async (req, res, next) => {
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
    if (reservation.status != "available") {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].RESERVATION_DELETE_ERROR,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const deleted = await reservationModel.deleteOne({
      _id: req.params.reservationId,
    });
    return res.status(StatusCodes.ACCEPTED).json({
      message: allMessages[req.query.ln].RESERVATION_DELETE,
      deleted,
    });
  }
);
export default deleteReservation