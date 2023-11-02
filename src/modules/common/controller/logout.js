import { StatusCodes } from "http-status-codes";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/*
Needed Data => No data
Return Data => Message 
*/
const logoutController = asyncErrorHandler(async (req, res, next) => {
  // // Check if user already logout or not
  // if (!req.user.loggedIn) {
  //   return next(
  //     new ErrorClass("This User is Already LoggedOut ", StatusCodes.BAD_REQUEST)
  //   );
  // }

  // Change the status of loggedIn in DB User
  req.user.loggedIn = false;
  await req.user.save();

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].LOGOUT_SUCCESS });
});
export default logoutController;
