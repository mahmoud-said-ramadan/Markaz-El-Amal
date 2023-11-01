import { hash } from "../../../utils/HashAndCompare.js";
import { getStatusFromUrl } from "../../../utils/code.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";

export const confirm = asyncErrorHandler(async (req, res, next) => {
  const { OTP, email } = req.body;
  const model = role(req.originalUrl);
  /**
   * check if this account valid ? ✔️ : ❎
   */
  const userExist = await model.findOne({ email: email });
  if (!userExist) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].NOT_VALID_ACCOUNT,
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  let status = getStatusFromUrl(req.originalUrl);
  if (status == "confirm") {
    /**
     * check if email is confirmed before ? ❎ : ✔️
     */
    if (userExist.confirmed) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].EMAIL_ALREADY_CONFIRMED,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  }
  /**
   * create expired date to check code if expired ( code will be expired after 5 min )
   */
  const expired = new Date(userExist.OTP.createdAt);
  if (
    OTP !== userExist.OTP?.code ||
    userExist.OTP?.status !== status ||
    new Date() > new Date(expired.setMinutes(expired.getMinutes() + 5))
  ) {
    return next(new ErrorClass(allMessages[req.query.ln].INVALID_CODE, 400));
  }
  let message;
  switch (status) {
    case "unsubscribe":
      // Delete User Account In Case He Is NOT Confirmed
      await model.deleteOne({ _id: userExist._id, confirmed: false });
      message = "UnSubscribed Successfully!";
      break;
    case "confirmChange":
      // check if the email Not Confirmed to other user
      if (await model.findOne({ email })) {
        return next(
          new ErrorClass("This Email Already Confirmed To Another User!", 409)
        );
      }
      await model.updateOne(
        { tempEmail: email },
        { confirmed: true, email }
      );
      message = allMessages[req.query.ln].SUCCESS_CONFIRM_EMAIL;
      break;
    case "password":
      let { newPassword } = req.body;
      // Hash the password Before updating
      newPassword = hash({ plaintext: newPassword });
      await model.findByIdAndUpdate(userExist._id, {
        password: newPassword,
      });
      message = "Password Changed Successfully!";
      break;
    default:
      await model.updateOne({ _id: userExist._id }, { confirmed: true });
      message = allMessages[req.query.ln].SUCCESS_CONFIRM_EMAIL;
      break;
  }
  return res.status(202).json({
    message,
  });
});
