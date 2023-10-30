import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../utils/errorHandling.js";
import ErrorClass from "../utils/errorClass.js";
import userModel from "../../DB/models/User.model.js";
import { allMessages } from "../utils/localizationHelper.js";

export const roles = {
  admin: "Admin",
  user: "User",
};
Object.freeze(roles);
export const auth = (roles = []) => {
  return asyncErrorHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].TOKEN_NOT_EXIST,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].BEARER_KEY,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].TOKEN_NOT_EXIST,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
    if (!decoded?.id) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].INVALID_PAYLOAD,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].USER_NOT_EXIST,
          StatusCodes.NOT_FOUND
        )
      );
    }
    if (!user.confirmed) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].USER_NOT_EXIST,
          StatusCodes.NOT_ACCEPTABLE
        )
      );
    }
    if (!roles.includes(user.role)) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].UNAUTHORIZED,
          StatusCodes.FORBIDDEN
        )
      );
    }
    req.user = user;
    return next();
  });
};
