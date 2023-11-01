import { hash, compare } from "../../../utils/HashAndCompare.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto-js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import { code, role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import sendEmail, { html } from "../../../utils/email.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
//-----------pre signup
export const preSignup = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const model = role(req.originalUrl);
  /**
   * check if email found before ? ❎ : ✔️
   * input: email
   */
  const check = await model.findOne({ email });
  if (check) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].EMAIL_EXIST,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  /**
   * generate OTP
   * Send a confirmation email to a user to confirm their email address
   */
  const OTP = code(5);
  if (
    !(await sendEmail({
      to: req.body.email,
      subject: "Confirmation E-Mail",
      html: html(`This Code For Make confirm email before create account`, OTP),
    }))
  ) {
    return {
      error: new ErrorClass(
        allMessages[req.query.ln].FAIL_SEND_EMAIL,
        StatusCodes.BAD_REQUEST
      ),
    };
  }
  // Hashing OTP
  const hashOTP = hash({ plaintext: OTP });
  return res
    .status(StatusCodes.OK)
    .json({
      message: allMessages[req.query.ln].CHECK_YOUY_INBOX,
      OTP: hashOTP,
    });
});
//------------Signup
export const signup = asyncErrorHandler(async (req, res, next) => {
  const { email , password, hashOTP, OTP } = req.body;
  /**
   * compare OTP and hashOTP
   */
  const match = compare({ plaintext: OTP, hashValue: hashOTP });
  if (!match) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].INVALID_CODE,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  /**
   * Get model ( doctor || patient || admin )
   */
  const model = role(req.originalUrl);
  /**
   * check if email found before ? ❎ : ✔️
   * input: email
   */
  const check = await model.findOne({ email });
  if (check) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].EMAIL_EXIST,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  /**
   * authorized: Admin - doctor - patient
   * input: phone?
   * output: Encrypt phone
   */
  if (req.body.phone) {
    req.body.phone = crypto.AES.encrypt(
      req.body.phone,
      process.env.encryption_key
    ).toString();
  }
  // Hashing password
  const hashpassword = hash({ plaintext: password });
  /**
   * create account: doctor || patient || admin
   */
  const newUser = new model({
    email,
    name: req.body.name,
    password: hashpassword,
    phone: req.body.phone,
    customId: nanoid(),
    DateOfBirth: req.body.DateOfBirth,
    gender: req.body.gender,
    confirmed: true
  });
  /**
   * input: image?
   * Upload image to cloudinary
   */
  if (req.files.image) {
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
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: allMessages[req.query.ln].CHECK_YOUY_INBOX, newUser });
});
