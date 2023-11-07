import { Router } from "express";
const router = Router();
import { fileUpload, filesValidation } from "../../utils/multer.js";
// import categoryEndPoint from "./category.endpoint.js";
import { createCategory } from "./controller/createCategory.js";
import { deleteCategory } from "./controller/deleteCategories.js";
import { getCategory } from "./controller/getCategory.js";
// import { updateCategory } from "./controller/updateCategory.js";

router
  .route(["/admin"])
  .post(
    categoryEndPoint.common,
    fileUpload(filesValidation.image).single("image"),
    createCategory
  )
  .get(
    auth(categoryEndPoint.get),
    getCategory
  )

  router
  .route(["/admin/:id"])
  .patch(
    categoryEndPoint.common,
    fileUpload(filesValidation.image).single("image"),
    updateCategory
  )
  .delete(
    auth(categoryEndPoint.common),
    deleteCategory
  )
  .get(
    auth(categoryEndPoint.get),
    getCategory
  )

export default router;
