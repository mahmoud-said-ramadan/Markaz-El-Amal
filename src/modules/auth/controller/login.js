import { StatusCodes } from "http-status-codes";
import { compare } from "../../../utils/HashAndCompare.js";
import ErrorClass from "../../../utils/errorClass.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
/**
 * authorized: Admin - doctor - patient
 * Logic: check if email found before ? ✔️: ❎ --> Check if email is confirmed --> compare password and hash password in DB --> Generate access token valid ( 2 m )
 * input: email - password
 * output: accessToken
 */
export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const model = role(req.originalUrl);
  /**
   * check if email found before ? ✔️: ❎
   * input: email
   */
  const user = await model.findOne({ email });
  if (!user) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].INVALID_INFO,
        StatusCodes.NOT_FOUND
      )
    );
  }
  // Check if email is confirmed
  if (!user.confirmed) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].EMAIL_EXIST_NOT_CONFIRMED,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  /**
   * compare password and hash password in DB
   */
  const match = compare({ plaintext: password, hashValue: user.password });
  if (!match) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].INVALID_INFO,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  /**
   * Generate access token valid ( 2 m )
   */
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email, role: model.modelName },
    expiresIn: 60 * 60 * 24 * 30 * 2,
  });
  // const refreshToken = generateToken({payload: {id: user._id , email:user.email} })
  user.loggedIn = true;
  await user.save();
  return res
    .status(StatusCodes.OK)
    .json({ message: allMessages[req.query.ln].SUCCESS, accessToken });
});
