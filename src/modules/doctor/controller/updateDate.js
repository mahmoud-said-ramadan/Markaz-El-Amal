import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/**
 * Needed data => to, from, time (body)
 * Returned data => Message
 * Who authorized => doctor
 */
const updateDate = asyncErrorHandler(async (req, res, next) => {
  const time = new Date(req.body.time);
  for (const appointment of req.user.appointment) {
    if (appointment.time.getTime() == time.getTime()) {
      if (req.body.from) appointment.from = req.body.from;
      if (req.body.to) appointment.to = req.body.to;
      break;
    }
  }
  await req.user.save();
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].SUCCESS, User: req.user });
});

export default updateDate;
