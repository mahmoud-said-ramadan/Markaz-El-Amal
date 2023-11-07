import { StatusCodes } from "http-status-codes";
import doctorModel from "../../../../DB/models/Doctor.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reviewModel from "../../../../DB/models/Review.model.js";

/**
 * Needed data => (comment, rate, doctorId) (body)
 * Returned data => Message, Review
 * Who authorized => patient
 */

const addReview = asyncErrorHandler(async (req, res, next) => {
  const { comment, rate, doctorId } = req.body;
  // Search for a doctor in db model
  const doctor = await doctorModel.findById(doctorId);
  if (!doctor) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NO_USER_FOUND,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Calculate new rate
  const totalRate = doctor.avgRate * doctor.rateNo;
  doctor.avgRate = (totalRate + rate) / (doctor.rateNo + 1);
  doctor.rateNo++;
  await doctor.save(); // apply new changes

  const review = await reviewModel.create({
    comment,
    doctorId,
    patientId: req.user._id,
    rate,
  });
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, review });
});

export default addReview;
