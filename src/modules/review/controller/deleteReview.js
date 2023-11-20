import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reviewModel from "../../../../DB/models/Review.model.js";

/**
 * Needed data => (reviewId) (params)
 * Returned data => Message
 * Who authorized => owner, doctor, admin
 */

const deleteReview = asyncErrorHandler(async (req, res, next) => {
  // Search for a review in db model
  const review = await reviewModel.findById(req.params.id).populate("doctorId");
  if (!review) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NO_REVIEW_FOUND,
        StatusCodes.NOT_FOUND
      )
    );
  }

  // Recalculate rating of the doctor
  const totalRate = review.doctorId.avgRate * review.doctorId.rateNo;
  review.doctorId.avgRate =
    review.doctorId.rateNo == 1
      ? 0
      : (totalRate - review.rate) / (review.doctorId.rateNo - 1);
  review.doctorId.rateNo--;
  await review.doctorId.save(); // apply new changes
  await review.deleteOne();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, review });
});

export default deleteReview;
