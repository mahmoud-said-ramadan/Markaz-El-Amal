import { hash, compare } from "../../../utils/HashAndCompare.js";
import jwt from "jsonwebtoken";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto-js";
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import { code, role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import sendEmail, { html } from "../../../utils/email.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
/**
 * Pre signup ✔️
 * authorized: Admin - doctor - patient
 * Logic: check if email found before ? ❎ : ✔️ --> Send a confirmation email to a user to confirm their email address 
 * input: email
 * output: Token that have hashing of OTP and will expire after 5 min
 */
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
  // generate token
  const token = generateToken({ payload: { OTP: hashOTP , email}, expiresIn: 60 * 5 });
  return res.status(StatusCodes.OK).json({
    message: allMessages[req.query.ln].CHECK_YOUY_INBOX,
    token,
  });
});
/**
 * Signup ✔️
 * authorized: Admin - doctor - patient
 * Logic: Decoded token --> Token expied? ❎ : ✔️ --> compare OTP and hashOTP ? ✔️ : ❎ --> create account and upload image in cloudinary
 * input: email - password - cPassword - token - OTP - phone? - image? - DateOfBirth? - gender?
 * output: msg
 */
export const signup = asyncErrorHandler(async (req, res, next) => {
  const { email, password, token, OTP } = req.body;
  /**
   * decoded token
   */
  try {
    var decoded = verifyToken({ token });
    if (!decoded?.OTP || email !== decoded.email) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].INVALID_PAYLOAD,
          StatusCodes.BAD_REQUEST
        )
      );
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].TOKEN_EXPIRED,
          StatusCodes.UNAUTHORIZED
        )
      );
    } else {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].UNAUTHORIZED,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
  }
  /**
   * compare OTP and hashOTP
   */
  const match = compare({ plaintext: OTP, hashValue: decoded.OTP });
  if (!match) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].INVALID_INFO,
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
    confirmed: true,
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
  switch (req.params.role) {
    case 'doctor':
        newUser.categories = req.body.categories
        newUser.bio = req.body.bio
        newUser.duration = req.body.duration      
      break;
  }
  await newUser.save();
  return res
    .status(StatusCodes.CREATED)
    .json({ message: allMessages[req.query.ln].ACCOUNT_CREATED });
});
