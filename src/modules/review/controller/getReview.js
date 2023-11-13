import reviewModel from "../../../../DB/models/Review.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
/**
 * Needed data => id 'review' (params) (get one review) or doctorId (body) (get all reviews)
 * Returned data => Message, reviews
 * Who authorized => anyone
 */
const getReview = asyncErrorHandler(async (req, res, next) => {
  // Get specific review or all reviews from DB (depends on there's id sended through params or not)
  let reviews = req.params.id
    ? await reviewModel.findById(req.params.id)
    : await reviewModel.find({ doctorId: req.body.doctorId });

  // If no one make a review yet
  if (!reviews || reviews.length == 0) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NO_REVIEW_FOUND,
        StatusCodes.NOT_FOUND
      )
    );
  }

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, reviews });
});

export default getReview;
