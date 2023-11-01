import cloudinary from "../cloudinary.js";
import ErrorClass from "../errorClass.js";
import CryptoJS from "crypto-js";
import { StatusCodes } from "http-status-codes";
import { allMessages } from "../localizationHelper.js";
// check for password
/*
Needed Data { patient => (name, phone, image)(optional)(body)
              doctor  => (name, phone, image, bio, consultationFee)(optional)(body)}
Return Data => Message , updated User 
*/
const updatePersonalInfo = (model) => {
  return async (req, res, next) => {
    // Find a user in the database
    const isUser = await model.findById(req.user._id);
    if (!isUser) {
      return next(
        new ErrorClass(
          allMessages[req.query.ln].USER_NOT_EXIST,
          StatusCodes.NOT_FOUND
        )
      );
    }

    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file?.path,
        {
          // Overwrite the previous image if exist
          public_id: isUser.image?.public_id,
          // Check if user already has image or not
          folder: isUser.image
            ? null
            : `internship/Markiz-elamal/${model.modelName}/${req.user.customId}/image`,
        }
      );
      req.body.image = { secure_url, public_id };
    }

    //Encrypt the phone number if is send
    if (req.body.phone) {
      req.body.phone = CryptoJS.AES.encrypt(
        req.body.phone,
        process.env.encryption_key
      ).toString();
    }

    // Update the user profile
    const updatedUser = await model.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    return res.status(StatusCodes.ACCEPTED).json({
      message: allMessages[req.query.ln].SUCCESS_UPDATE_USER,
      updatedUser,
    });
  };
};

export default updatePersonalInfo;
