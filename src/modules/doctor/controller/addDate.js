import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/**
 * Needed data => to, from, time (body)
 * Returned data => Message
 * Who authorized => doctor
 */
const addDate = asyncErrorHandler(async (req, res, next) => {
  req.user.appointment.push({
    from: req.body.from,
    to: req.body.to,
    time: req.body.time,
    
  });
  await req.user.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, User: req.user });
});

export default addDate;
