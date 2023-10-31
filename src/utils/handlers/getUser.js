import { StatusCodes } from "http-status-codes";
import ErrorClass from "../errorClass.js";
import { allMessages } from "../localizationHelper.js";
/*
Needed Data => UserId (params)
Return Data => Message , User
*/

const getUser = (model) => {
  async (req, res, next) => {
    const { id } = req.params; // Get userId from params

    const user = await model.findById(id); // Search for user in DB

    // Validate that user is exist
    if (!user) {
      return next(
        new ErrorClass(allMessages[req.query.ln].USER_NOT_EXIST),
        StatusCodes.NOT_FOUND
      );
    }

    // Return user Data
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS, user });
  };
};

export default getUser;
