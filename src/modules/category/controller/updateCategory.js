import categoryModel from "../../../../DB/models/Category.model.js";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
/**
 * Update category ✔️
 * authorized: Admin
 * Logic: find category -> check if req.body.name -> Check if other category have the same name ->. req.file -> delete from cloudinary -> update
 * input: name of category , image
 * output: updated
 */
export const updateCategory = async (req, res, next) => {
  const { en , ar } = req.body;
  //Find Category
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorClass(
        `${allMessages[req.query.ln].INVALID_INFO}`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  //Check name
  if (req.body.en || req.body.ar) {
    //Check if old name != new name
    if (category.name.ar == req.body.ar && category.name.en == req.body.en) {
      return next(
        next(
          new ErrorClass(
            `${allMessages[req.query.ln].DUPLICATE_NAME}`,
            StatusCodes.BAD_REQUEST
          )
        )
      );
    }
    //Check if other category have the same name
    if (
      await categoryModel.findOne({
        $or: [{ name: req.body.ar }, { name: req.body.en }],
      })
    ) {
      return next(
        new ErrorClass(
          `${allMessages[req.query.ln].DUPLICATE_NAME} ${req.body.name}`,
          StatusCodes.CONFLICT
        )
      );
    }
    category.name = {
      en: en,
      ar: ar,
    };
    category.slug = {
      en: slugify(en, "-"),
      ar: slugify(ar, "-"),
    };
  }
  //file
  if (req.file) {
    //Upload image in cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/category` }
    );
    //Delete old image from cloudinary
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  //Update category
  await category.save();
  return res
    .status(200)
    .json({ message: `${allMessages[req.query.ln].SUCCESS}`, category });
};
