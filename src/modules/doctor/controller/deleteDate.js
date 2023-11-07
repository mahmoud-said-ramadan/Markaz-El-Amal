import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/**
 * Needed data => time (body)
 * Returned data => Message
 * Who authorized => doctor
 */
const deleteDate = asyncErrorHandler(async (req, res, next) => {
  await req.user.updateOne({
    $pull: { appointment: { time: req.body.time } },
  });
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS });
});

export default deleteDate;
