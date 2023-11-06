import Router from "express";
import { auth } from "../../middleware/auth.js";
import reviewEndpoint from "./review.endpoint.js";
import getReview from "./controller/getReview.js";

const router = Router();

// addReview
// updateReview
// deleteReview
// getReview

router
  .route(["/", "/:id"])
  .post(auth(reviewEndpoint.add_update), addReview)
  .put(auth(reviewEndpoint.add_update), updateReview)
  .delete(auth(reviewEndpoint.get_delete), deleteReview)
  .get(auth(reviewEndpoint.get_delete), getReview);

export default router;
