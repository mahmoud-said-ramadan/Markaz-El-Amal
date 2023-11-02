import ErrorClass from "./errorClass.js";
import { StatusCodes } from "http-status-codes";

export const errorHandel = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.statusCode,
    ErrorMessage: err.message,
  });
};

export const asyncErrorHandler = (endPoint) => {
  return (req, res, next) => {
    if (req.params.role) {
      switch (req.params.role) {
        case "doctor": 
          break;
        case "patient":
          break;
        case "admin":
          break;
        default:
          return next(new ErrorClass("Invalid URL", StatusCodes.BAD_REQUEST));
      }
    }
    endPoint(req, res, next).catch((err) => {
      next(new ErrorClass(err, 500));
    });
  };
};
