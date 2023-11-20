import categoryModel from "../../../../DB/models/Category.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
/**
 * Update category ✔️
 * authorized: Admin
 * Logic: find category -> check if req.body.name -> Check if other category have the same name ->. req.file -> delete from cloudinary -> update
 * input: name of category , image
 * output: msg , data of updated category
 */
export const updateCategory = async (req, res, next) => {
  // const { nameEN , nameAR } = req.body;
  //Find Category
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorClass(
        allMessages[req.query.ln].INVALID_INFO,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  //Check name
  if (req.body.nameEN || req.body.nameAR) {
    //Check if old name != new name
    if (
      category.name.ar == req.body.nameAR &&
      category.name.en == req.body.nameEN
    ) {
      //Check if other category have the same name
      if (
        await categoryModel.findOne({
          $or: [{ "name.ar": req.body.nameAR }, { "name.en": req.body.nameEN }],
          createdBy: { $ne: req.user._id },
        })
      ) {
        return next(
          new ErrorClass(
            allMessages[req.query.ln].DUPLICATE_NAME,
            StatusCodes.CONFLICT
          )
        );
      }
      category.name = {
        en: req.body.nameEN,
        ar: req.body.nameAR,
      };
      category.slug = {
        en: slugify(req.body.nameEN, "-"),
        ar: slugify(req.body.nameAR, "-"),
      };
    }
  }
  //file
  if (req.file) {
    //Upload image in cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/category/${category.customId}` }
    );
    //Delete old image from cloudinary
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  //Update category
  await category.save();
  return res
    .status(200)
    .json({
      message: allMessages[req.query.ln].SUCCESS_EDIT_CATEGORY,
      category,
    });
};
