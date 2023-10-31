import { hash ,compare } from "../../../utils/HashAndCompare.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto-js";
import { generateConfirmCode } from "../../../utils/code.js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from 'nanoid'
import { code, role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import sendEmail, { html } from "../../../utils/email.js";

export const preSignup = async (req, res, next) => {
  const { email } = req.body;
  const model = role(req.originalUrl);
  // Find user
  const check = await model.findOne({ email });
  // check if user found before
  if (check) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].EMAIL_EXIST,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // generate OTP
  const OTP = code(5)
  // Send a confirmation email to a user to confirm their email address
  if (
    !(await sendEmail({
      to: req.body.email,
      subject: "Confirmation E-Mail",
      html: html(`This Code For Make confirm email before create account`, OTP),
    }))
  ) {
    return {
      error: new ErrorClass(allMessages[req.query.ln].FAIL_SEND_EMAIL, 400),
    };
  }
  const hashOTP =  hash({ plaintext: OTP })
  return res
    .status(201)
    .json({ message: allMessages[req.query.ln].CHECK_YOUY_INBOX, OTP: hashOTP });
};

export const signup = async (req, res, next) => {
  const { email, password, hashOTP , OTP } = req.body;
  const match = compare({ plaintext: OTP , hashValue: hashOTP});
  if (!match) {
    return next(new ErrorClass(allMessages[req.query.ln].INVALID_CODE, StatusCodes.BAD_REQUEST));
  }
  const model = role(req.originalUrl);
  // Find user
  const check = await model.findOne({ email });
  // check if user found before
  if (check) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].EMAIL_EXIST,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // Send code to confirm user email
  if (req.body.phone) {
    // Encrypt phone
    req.body.phone = crypto.AES.encrypt(
      req.body.phone,
      process.env.encryption_key
    ).toString();
  }
  // Hash password
  const hashpassword = hash({ plaintext: password });
  // Create User
  const newUser = new model({
    name: req.body.name,
    email,
    password: hashpassword,
    phone: req.body.phone,
    customId: nanoid(),
    DateOfBirth: req.body.DateOfBirth,
    gender: req.body.gender,
  });
  if (req.files.image) {
    //Upload image in cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        folder: `${process.env.APP_NAME}/${req.params.role}/${newUser.customId}/profile`,
      },
      (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.log(result);
        }
      }
    );
    newUser.image = { secure_url, public_id };
  }
  await newUser.save();
  //send code to confirm email
  const codeStatus = await generateConfirmCode(req);
  if (codeStatus.error) {
    return next(
      new ErrorClass(codeStatus.error.message, codeStatus.error.statusCode)
    );
  }
  return res
    .status(201)
    .json({ message: allMessages[req.query.ln].CHECK_YOUY_INBOX, newUser });
};
