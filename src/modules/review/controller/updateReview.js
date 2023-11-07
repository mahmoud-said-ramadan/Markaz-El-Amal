import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import reviewModel from "../../../../DB/models/Review.model.js";

/**
 * Needed data => (comment, rate) (body) id 'reviewId' (params)
 * Returned data => Message
 * Who authorized => owner
 */

const updateReview = asyncErrorHandler(async (req, res, next) => {
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

  // Check who want to make changes (owner or someone else)
  if (req.user._id != review.patientId.toString()) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NO_REVIEW_FOUND,
        StatusCodes.FORBIDDEN
      )
    );
  }
  if (req.body.comment) review.comment = req.body.comment;

  if (req.body.rate) {
    // Calculate new rate
    const totalRate = review.doctorId.avgRate * review.doctorId.rateNo;
    review.doctorId.avgRate =
      (totalRate - review.rate + req.body.rate) / review.doctorId.rateNo;
    review.rate = req.body.rate;
    // apply new changes
    await review.doctorId.save();
  }

  // apply new changes
  await review.save();

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, review });
});

export default updateReview;
