import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: joi
    .object({
      comment: joi.string(),
      rate: joi.number().min(0).max(5).required(),
      doctorId: generalFields.id.required(),
    })
    .required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const update = {
  body: joi
    .object({
      comment: joi.string(),
      rate: joi.number().min(0).max(5).required(),
    })
    .required(),
  params: joi
    .object({
      id: generalFields.id.required(),
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const get = {
  body: joi.object({}).required(),
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};
