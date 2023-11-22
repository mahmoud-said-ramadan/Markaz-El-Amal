import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = {
  body: joi
    .object({
      name: joi.string().trim().min(3).max(25).required(),
      email: generalFields.email.lowercase().required(),
      // will make a password pattern later
      password: generalFields.password.required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      phone: generalFields.phone.required(),
      OTP: generalFields.code.required(),
      hashOTP: joi.string().required(),
    })
    .required(),
  params: joi
    .object({
      role: joi.string().valid("patient", "doctor", "admin").required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
  file: generalFields.file,
};

export const login = {
  body: joi
    .object({
      email: generalFields.email.lowercase().required(),
      password: generalFields.password.required(),
    })
    .required(),
  params: joi
    .object({
      role: joi.string().valid("patient", "doctor", "admin").required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const confirm = {
  body: joi
    .object({
      email: generalFields.email.lowercase().required(),
      code: joi
        .string()
        .length(5)
        .regex(/^[0-9]{5}$/)
        .required(),
    })
    .required(),
  params: joi
    .object({
      role: joi.string().valid("patient", "doctor", "admin").required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const reset = {
  body: joi
    .object({
      newPassword: generalFields.password.required(),
      email: generalFields.email.lowercase().required(),
      OTP: generalFields.code.required(),
    })
    .required(),
  params: joi
    .object({
      role: joi.string().valid("patient", "doctor", "admin").required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const generate = {
  body: joi
    .object({
      email: generalFields.email.lowercase().required(),
    })
    .required(),
  params: joi
    .object({
      role: joi.string().valid("patient", "doctor", "admin").required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};
