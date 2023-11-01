import { Router } from "express";
const router = Router();
import { fileUpload, filesValidation } from "../../utils/multer.js";
import { preSignup, signup } from "./controller/signup.js";
import { login } from "./controller/login.js";
import { confirm } from "./controller/confirm.js";
import { generateConfirmation } from "./controller/generateConfirmation.js";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
/**
 * Pre signup ✔️
 * authorized: Admin - doctor - patient
 * input: email
 * output: Hashing of OTP
 */
router.post("/:role/preSignup", validation(validators.generate), preSignup);
/**
 * Signup ✔️
 * authorized: Admin - doctor - patient
 * input: email - password - cPassword - hashOTP - OTP - phone? - image? - DateOfBirth? - gender?
 * output: All data for testing
 */
router.post(
  "/:role/signup",
  fileUpload(filesValidation.image).fields([{ name: "image", maxCount: 1 }]),
  signup
);
/**
 * Login ✔️
 * authorized: Admin - doctor - patient
 * input: email - password
 * output: accessToken
 */
router.post("/:role/login", login);
/**
 * Forget password ✔️
 * authorized: Admin - doctor - patient
 * input: email 
 * output: Sent email
 */
router.post(
  "/:role/password/forget",
  validation(validators.generate),
  generateConfirmation
);
/**
 * Reset password ✔️
 * authorized: Admin - doctor - patient
 * input: OTP, email
 * output: 
 */
router.post("/:role/password/reset", validation(validators.reset), confirm);
// router.post("/:role/confirm", validation(validators.confirm), confirm);
router.post(
  "/:role/changeEmail/confirm",
  validation(validators.confirm),
  confirm
);
router.post(
  "/:role/newConfirm",
  validation(validators.generate),
  generateConfirmation
);
router.post(
  "/:role/unsubscribe",
  validation(validators.generate),
  generateConfirmation
);

export default router;
