import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import ErrorClass from "../errorClass.js";
import { allMessages } from "../localizationHelper.js";

/*
Needed Data => (Old and New) password (body)
Return Data => Message
*/
const changePassword = (model) => {
  return async (req, res, next) => {
    const { oldPassword, newPassword } = req.body; // Get all needed data from body

    // Making sure that the oldPassword is correct
    if (!bcryptjs.compareSync(oldPassword, req.user.password)) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].FAIL_OLD_PASS_MATCHING,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Hashing new password before store it into DB
    const newPasswordHashed = bcryptjs.hashSync(
      newPassword,
      parseInt(process.env.SALT_ROUND)
    );

    // update password on user DB
    await model.updateOne(
      { _id: req.user._id },
      {
        password: newPasswordHashed,
      }
    );

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: allMessages[req.query.ln].SUCCESS });
  };
};
export default changePassword;
