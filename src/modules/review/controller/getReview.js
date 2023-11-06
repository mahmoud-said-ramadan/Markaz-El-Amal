import reviewModel from "../../../../DB/models/Review.model";
import ErrorClass from "../../../utils/errorClass";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper";
import { StatusCodes } from "http-status-codes";
/**
 * Needed data => id 'review' (params) (get one review) or doctorId (body) (get all reviews)
 * Returned data => Message, reviews
 * Who authorized => anyone
 */
const getReview = asyncErrorHandler(async (req, res, next) => {
  // Get specific review or all reviews from DB (depends on there's id sended through params or not)
  let Reviews = req.param.id
    ? await reviewModel.findById(req.param.id).populate("doctorId")
    : await reviewModel
        .find({ doctorId: req.body.doctorId })
        .populate("doctorId");

  // If no one make a review yet
  if (!Reviews && Reviews?.length) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NO_DATA_FOUND,
        codes,
        StatusCodes.NOT_FOUND
      )
    );
  }

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, Reviews });
});

export default getReview;
