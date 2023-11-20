import categoryModel from "../../../../DB/models/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
/**
 * Delete category ✔️
 * authorized: created by ... (Admin)
 * input: name of category , image
 * output: deleted 
 */
export const deleteCategory = asyncErrorHandler( async (req, res, next) => {
    const { id } = req.params;
    const found = await categoryModel.findOne({_id : id , createdBy: req.user._id })
    if (!found) {
      return next( new ErrorClass(
        `${allMessages[req.query.ln].NOT_FOUND}`,
        StatusCodes.CONFLICT
      ));
    }
    //delete from cloudinary
    await cloudinary.uploader
    .destroy(found.image.public_id)
    .then((result) => console.log(result));
    //delete from DB  
    const category = await categoryModel.deleteOne({ _id: id , createdBy: req.user._id})
    return res.status(201).json({ message: `${allMessages[req.query.ln].SUCCESS_DELETED}`, category });
  });