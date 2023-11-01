import { StatusCodes } from "http-status-codes";
import ErrorClass from "../errorClass.js";
import { allMessages } from "../localizationHelper.js";
import bcrypt from "bcryptjs";
/*
Needed Data => New email, code, hashedCode (body)
Return Data => Message 
*/
const confirmChangeEmail = (model) => {
  return async (req, res, next) => {
    const { newEmail, code, hashedCode } = req.body; // Get all needed data from body

    // Check if the code match the code that send on email or not
    if (!bcrypt.compareSync(code, hashedCode)) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].INVALID_CODE,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    if (Date.now()  > req.user.OTP.createdAt.getTime() + (5 * 60 * 1000) ) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].CODE_EXPIRED,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    // console.log({newEmail,_id:req.user._id,emailuser:req.user.email});
    // await model.updateOne({ _id: req.user._id }, { email: newEmail });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS });
  };
};
export default confirmChangeEmail;
