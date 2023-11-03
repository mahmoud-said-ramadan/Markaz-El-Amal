import { StatusCodes } from "http-status-codes";
import { allMessages } from "../../../utils/localizationHelper.js";
import ErrorClass from "../../../utils/errorClass.js";
/*
Needed Data => No data
Return Data => Message , Users
Who authorized => Doctor, Patient
*/

const getAllUsers = (model) => {
  return async (req, res, next) => {
    const users = await model.find(); // Search for  all users in DB

    // Validate that there is users exist in DB
    if (!users.length) {
      return next(
        new ErrorClass(allMessages[req.query.ln].NO_USER_FOUND),
        StatusCodes.NOT_FOUND
      );
    }

    // Return users Data
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS, users });
  };
};
export default getAllUsers;
