import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/**
 * authorized: Doctor
 * logic: Get confirm | accepted
 * input:
 * output: msg ,reservations
 */
const getStatusController = asyncErrorHandler(async (req, res, next) => {
  const status = getStatus(req);
  // array will hold the final data after pagination
  const data = [];
  for (let index = 0; index < req.user[status].length; index++) {
    let element;
    //example => populate('accepted')
    const reservation = await req.user.populate({
      path: `${status}`,
      select: "appointmentSeasion patientId",
    });
    // make a populate for each element to populate on patient id =>  example reservation.accepted[0].populate("patientId")
    element = await reservation[status][index].populate({
      path: "patientId",
      select: "name -_id",
    });
    data.push(element);
  }
  return data.length
    ? res.status(StatusCodes.OK).json({
        message: allMessages[req.query.ln].SUCCESS,
        reservations: data,
      })
    : res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: allMessages[req.query.ln].NOT_FOUND });
});
const getStatus = (req) => {
  if (req.originalUrl.includes("accepted")) return "accepted"; // ✔️
  if (req.originalUrl.includes("confirm")) return "confirm"; // ✔️
};
export default getStatusController;
