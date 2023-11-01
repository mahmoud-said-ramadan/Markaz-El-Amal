import { StatusCodes } from "http-status-codes";
import { generateConfirmCode } from "../code.js";
import ErrorClass from "../errorClass.js";
import { allMessages } from "../localizationHelper.js";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import sendEmail, { html } from "../email.js";
/*
Needed Data => New email (body)
Return Data => Message , new email hashed
*/
const changeEmail = (model) => {
  return async (req, res, next) => {
    const { email } = req.body; // Get all needed data from body

    // check if new email doesn't match the old ont
    if (req.user.email == email) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].EMAIL_SAME_AS_OLD,
          StatusCodes.CONFLICT
        )
      );
    }
    // check if email is used by another one or not
    const emailExist = await model.findOne({
      _id: { $ne: req.user._id },
      email,
    });

    if (emailExist) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].EMAIL_EXIST,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    //Generate OTP Code
    const code = customAlphabet("0123456789", 5);
    const OTP = {
      code: code(5),
      createdAt: Date.now(),
      status: "confirmChange",
    };
    const htmlCode = html(`This Code For confirm your new email`, OTP.code);
    //Send New Confirmation Mail

    await sendEmail({
      to: email,
      subject: "Confirmation E-Mail",
      html: htmlCode,
    });
    // console.log({code:codeStatus.code});
    const newCodeHashed = bcrypt.hashSync(
      OTP.code,
      parseInt(process.env.SALT_ROUND)
    );

    await model.updateOne({ _id: req.user._id }, { OTP });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS, newCodeHashed });
  };
};
export default changeEmail;
