import { StatusCodes } from "http-status-codes";
import { allMessages } from "../../../utils/localizationHelper.js";
import ErrorClass from "../../../utils/errorClass.js";
/*
Needed Data => UserId (params) (specific user) or nothing (all users)
Return Data => Message , User
Who authorized => Doctor, Patient
*/

const getUser = (model) => {
  return async (req, res, next) => {
    // Check if the client want to  get specific user or all users
    const users = req.params.id
      ? await model.findById(req.params.id)
      : await model.find();

    // Validate that there is users exist in DB
    if (!users || users.length == 0) {
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

export default getUser;
