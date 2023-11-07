import slugify from "slugify";
import categoryModel from "../../../../DB/models/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
/**
 * Create category ✔️
 * authorized: Admin
 * Logic: check if name of category if found before then iupload image on cloudinary and create category
 * input: name of category , image
 * output: created
 */
export const createCategory = async (req, res, next) => {
  const { en , ar } = req.body;
  //Must be a unique name
  if (await categoryModel.findOne({ name: { en: en, ar: ar } })) {
    return next(
      new ErrorClass(
        `${allMessages[req.query.ln].DUPLICATE_NAME}`,
        StatusCodes.CONFLICT
      )
    );
  }
  //Upload image in cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category` }
  );
  //Create category
  const category = await categoryModel.create({
    name: {
      en: en,
      ar: ar,
    },
    slug: {
      en: slugify(en, "-"),
      ar: slugify(ar, "-"),
    },
    image: { secure_url, public_id },
    // createdBy: req.user._id
  });
  return res
    .status(201)
    .json({ message: `${allMessages[req.query.ln].SUCCESS}`, category });
};
