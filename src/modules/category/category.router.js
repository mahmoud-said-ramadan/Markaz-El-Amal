import { Router } from "express";
const router = Router();
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { createCategory } from "./controller/createCategory.js";
import { deleteCategory } from "./controller/deleteCategory.js";
import { getCategory } from "./controller/getCategory.js";
import { updateCategory } from "./controller/updateCategory.js"
import { auth } from "../../middleware/auth.js";
import categoryEndPoint from "./category.endpoint.js";
import {  validateId, validation } from "../../middleware/validation.js";
import * as validator from "./category.validation.js"
router
  .route(["/admin"])
  .post(
    auth(categoryEndPoint.common),
    fileUpload(filesValidation.image).single("image"),
    validation(validator.createCategory),
    createCategory
  )
  .get(
    auth(categoryEndPoint.get),
    getCategory
    )
    
    router
    .route(["/admin/:id"])
    .patch(
      auth(categoryEndPoint.common),
    fileUpload(filesValidation.image).single("image"),
    validation(validator.updateCategory),
    updateCategory
    )
    .delete(
    auth(categoryEndPoint.common),
    validation(validateId),
    deleteCategory
    )
    .get(
      auth(categoryEndPoint.get),
      validation(validateId),
    getCategory
  )

  router.route(["/:role"])
  .get(
    auth(categoryEndPoint.get),
    getCategory
  )
export default router;
