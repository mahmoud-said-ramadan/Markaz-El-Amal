import sendEmail, { html } from "./email.js";
import ErrorClass from "./errorClass.js";
import { allMessages } from "./localizationHelper.js";
import { code, role } from "./shared.js";
const sendCode = async (user, status , model) => {
  // If Last Code Send In Time Less Than 5 Mints
  if (Date.now() < user.codeInfo?.createdAt + 5 * 60 * 1000) {
    return {
      error: new ErrorClass(
        allMessages[req.query.ln].NOT_EXPIRED,
        409
      ),
    };
  }

  //Generate OTP Code
  const OTP = {
    code: code(5),
    createdAt: Date.now(),
    status,
  };
console.log(OTP);
  const htmlCode = html(`This Code For Make ${status}`, OTP);
  //Send New Confirmation Mail
  if (
    !(await sendEmail({
      to: user.email,
      subject: "Confirmation E-Mail",
      html:htmlCode,
    }))
  ) {
    return {
      error: new ErrorClass(allMessages[req.query.ln].FAIL_SEND_EMAIL, 400),
    };
  }
  await model.updateOne({ _id: user._id }, { OTP });
  return true;
};

export const getStatusFromUrl = (url) => {
  if (url.includes("unsubscribe")) {
    return "unsubscribe";
  } else if (url.includes("changeEmail")) {
    return "confirmChange";
  } else if (url.includes("password")) {
    return "password";
  } else {
    return "confirm";
  }
};

export const generateConfirmCode = async (req) => {
  const model = role(req.originalUrl)
  const status = getStatusFromUrl(req.originalUrl);
  console.log({status});
  let userExist;
  status === "confirmChange"
    ? (userExist = req.user)
    : (userExist = await model.findOne({ email: req.body.email }));
  if (!userExist) {
    return {
      error: new ErrorClass(allMessages[req.query.ln].USER_NOT_EXIST, 404),
    };
  }
  const codeSentStatus = await sendCode(userExist, status , model);
  if (codeSentStatus.error) {
    return codeSentStatus;
  }
  return true;
};