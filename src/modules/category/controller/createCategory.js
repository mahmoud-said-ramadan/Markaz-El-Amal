import slugify from "slugify";
import categoryModel from "../../../../DB/models/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import ErrorClass from "../../../utils/errorClass.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";
/**
 * Create category ✔️
 * authorized: Admin
 * Logic: check if name of category if found before then iupload image on cloudinary and create category
 * input: name of category , image
 * output: msg - Data of new category
 */
export const createCategory = async (req, res, next) => {
  const { nameEN, nameAR } = req.body;
  //Must be a unique name
  if (await categoryModel.findOne({
    $or: [{ "name.ar": nameAR }, { "name.en": nameEN }],
  })) {
    return next(
      new ErrorClass(
        `${allMessages[req.query.ln].DUPLICATE_NAME_CATERGORY}`,
        StatusCodes.CONFLICT
      )
    );
  }
  const customId = nanoid(5);
  //Upload image on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category/${customId}` }
  );
  //Create category
  const category = await categoryModel.create({
    name: {
      en: nameEN,
      ar: nameAR,
    },
    slug: {
      en: slugify(nameEN, "-"),
      ar: slugify(nameAR, "-"),
    },
    image: { secure_url, public_id },
    createdBy: req.user._id,
    customId,
  });
  if (!category) {
    return next(
      new ErrorClass(
        `${allMessages[req.query.ln].FAIL_CREATE_CATEGORY}`,
        StatusCodes.CONFLICT
      )
    );
  }
  return res.status(201).json({
    message: `${allMessages[req.query.ln].SUCCESS_CREATE_CATEGORY}`,
    category,
  });
};