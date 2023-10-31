import { StatusCodes } from "http-status-codes";
import { generateConfirmCode } from "../code.js";
import ErrorClass from "../errorClass.js";
import { allMessages } from "../localizationHelper.js";
import bcrypt from "bcryptjs";
/*
Needed Data => New email (body)
Return Data => Message , new email hashed
*/
const changeEmail = (model) => {
  async (req, res, next) => {
    const { email } = req.body; // Get all needed data from body
    // Find user
    const emailExist = await model.findOne({ email });
    if (emailExist) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].EMAIL_EXIST,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    //Generate code
    const codeStatus = await generateConfirmCode(req);
    if (codeStatus.error) {
      return next(
        new ErrorClass(codeStatus.error.message, codeStatus.error.statusCode)
      );
    }
    // await model.updateOne({ _id: req.user._id }, { tempEmail: email });

    const newEmailHashed = bcrypt.hashSync(email, process.env.SALT_ROUND);
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS, newEmailHashed });
  };
};
export default changeEmail;
