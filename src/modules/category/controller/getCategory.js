import categoryModel from "../../../../DB/models/Category.model.js";
import { allMessages } from "../../../utils/localizationHelper.js";
import ErrorClass from "../../../utils/errorClass.js";
import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../../../utils/errorHandling.js";
export const getCategory = asyncErrorHandler(async (req, res, next) => {
  /**
   * Get category || Categories ✔️
   * authorized: Admin | Doctor | Patient
   * input: id
   * output: Get one category
   */
  const category = req.params.id
    ? await categoryModel.findById(req.params.id).select('name slug image')
    : await categoryModel.find().select('name slug image');
  if (!category) {
    return next(
      new ErrorClass(
        ` ${allMessages[req.query.ln].NOT_FOUND}`,
        StatusCodes.CONFLICT
      )
    );
  }
  if (req.params.id) {
    category.name = category.name[req.query.ln];
    category.slug = category.slug[req.query.ln];
  } else {
    for (let i = 0; i < category.length; i++) {
      category[i].name = category[i].name[req.query.ln];
      category[i].slug = category[i].slug[req.query.ln];
      }
  }
  return res
    .status(200)
    .json({ message: `${allMessages[req.query.ln].SUCCESS}`, category });
});
