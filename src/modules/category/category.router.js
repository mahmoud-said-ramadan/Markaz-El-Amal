import { Router } from "express";
const router = Router();
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { createCategory } from "./controller/createCategory.js";
import { deleteCategory } from "./controller/deleteCategory.js";
import { getCategory } from "./controller/getCategory.js";
import { updateCategory } from "./controller/updateCategory.js"
import { auth } from "../../middleware/auth.js";
import categoryEndPoint from "./category.endpoint.js";

router
  .route(["/admin"])
  .post(
    auth(categoryEndPoint.common),
    fileUpload(filesValidation.image).single("image"),
    createCategory
  )

  router
  .route(["/admin/:id"])
  .patch(
    auth(categoryEndPoint.common),
    fileUpload(filesValidation.image).single("image"),
    updateCategory
  )
  .delete(
    auth(categoryEndPoint.common),
    deleteCategory
  )

  router
  .route(["/:role/:id"])
  .get(
    auth(categoryEndPoint.get),
    getCategory
  )

  router.route(["/:role"])
  .get(
    auth(categoryEndPoint.get),
    getCategory
  )
export default router;
