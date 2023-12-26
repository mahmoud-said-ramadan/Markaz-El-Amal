import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import doctorModel from "../../../../DB/models/Doctor.model.js";
/**
 * authorized: Doctor
 * logic: searh rejected patients
 * input:
 * output: msg ,reservations
 */
const rejected = asyncErrorHandler(async (req, res, next) => {
  const rejected = await doctorModel
    .findById(req.user._id)
    .select("rejected.patientId rejected.reservationId")
    .populate([
      { path: `rejected.patientId`, select: "name" },
      { path: `rejected.reservationId`, select: "appointmentSeasion" },
    ]);
  return res.status(StatusCodes.OK).json({
    message: allMessages[req.query.ln].SUCCESS,
    rejected,
  });
});
export default rejected;
