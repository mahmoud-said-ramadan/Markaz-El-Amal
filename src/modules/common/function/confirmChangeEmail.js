import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
/*
Needed Data => New email, code, hashedCode (body)
Return Data => Message 
Who authorized => Doctor, Patient
*/
const confirmChangeEmail = (model) => {
  return async (req, res, next) => {
    const { newEmail, code, token } = req.body; // Get all needed data from body

    // Extract all token content (hashed code)
    const decode = jwt.verify(token, process.env.TOKEN_SIGNATURE);

    // Check if the code expire or not
    if (Date.now() > decode.date + 5 * 60 * 1000) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].CODE_EXPIRED,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Check if the code match the code that send on email or not
    if (!bcrypt.compareSync(code, decode.code)) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].INVALID_CODE,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    await model.updateOne({ _id: req.user._id }, { email: newEmail });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS });
  };
};
export default confirmChangeEmail;
