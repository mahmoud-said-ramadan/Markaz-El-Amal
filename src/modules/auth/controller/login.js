import { StatusCodes } from "http-status-codes";
import { compare } from "../../../utils/HashAndCompare.js";
import ErrorClass from "../../../utils/errorClass.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { role } from "../../../utils/shared.js";
import { allMessages } from "../../../utils/localizationHelper.js";

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const model = role(req.originalUrl)
    const user = await model.findOne({ email });
    if (!user) {
      return next(new ErrorClass(allMessages[req.query.ln].INVALID_INFO, StatusCodes.NOT_FOUND));
    }
    // Check confirm email
    if (!user.confirmed) {
      return next(new ErrorClass(allMessages[req.query.ln].EMAIL_EXIST_NOT_CONFIRMED, StatusCodes.BAD_REQUEST));
    }
    // Check password
    const match = compare({ plaintext: password, hashValue: user.password });
    if (!match) {
      return next(new ErrorClass(allMessages[req.query.ln].INVALID_INFO, StatusCodes.BAD_REQUEST));
    }
    const accessToken = generateToken({payload: {id: user._id , email:user.email} } )
    const refreshToken = generateToken({payload: {id: user._id , email:user.email} } , {expiresIn : 60 * 60 * 24 * 30 * 2 } )
    user.loggedIn = true
    await user.save() 
    return res.status(StatusCodes.OK).json({ message: "Done", accessToken, refreshToken });
  };