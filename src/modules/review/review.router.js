import Router from "express";
import { auth } from "../../middleware/auth.js";
import reviewEndpoint from "./review.endpoint.js";
import getReview from "./controller/getReview.js";
import addReview from "./controller/addReview.js";
import updateReview from "./controller/updateReview.js";
import deleteReview from "./controller/deleteReview.js";
import * as validator from "./review.validation.js";
import { validateId, validation } from "../../middleware/validation.js";

const router = Router();
// addReview
// updateReview
// deleteReview
// getReview

router
  .route(["/", "/:id"])
  .post(auth(reviewEndpoint.add_update), validation(validator.add), addReview)
  .put(
    auth(reviewEndpoint.add_update),
    validation(validator.update),
    updateReview
  )
  .delete(auth(reviewEndpoint.get_delete), validation(validateId), deleteReview)
  .get(auth(reviewEndpoint.get_delete), validation(validator.get), getReview);

export default router;
