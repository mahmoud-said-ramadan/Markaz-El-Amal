import { hash } from "../../../utils/HashAndCompare.js";
import { getStatusFromUrl } from "../../../utils/code.js";
import ErrorClass from "../../../utils/errorClass.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import { role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";

export const confirm = asyncErrorHandler(async (req, res, next) => {
  const { code, email } = req.body;
  const model = role(req.originalUrl);
  const userExist = await model.findOne({ email: email });
  if (!userExist) {
    return next(
      new ErrorClass(allMessages[req.query.ln].NOT_VALID_ACCOUNT, 404)
    );
  }
  let status = getStatusFromUrl(req.originalUrl);
  // This Code Expires in 5 Mints
  if (
    code !== userExist.OTP?.code ||
    userExist.OTP?.status !== status ||
    Date.now() > userExist.OTP?.createdAt + 5 * 60 * 1000
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
        { confirmed: true, email, tempEmail: "" }
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
