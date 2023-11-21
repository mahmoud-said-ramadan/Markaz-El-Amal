import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCategory = {
  body: joi
    .object({
      nameEN: joi.string().required(),
      nameAR: joi.string().required(),
    })
    .required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
  file: generalFields.file.required(),
};

export const updateCategory = {
  body: joi
    .object({
      nameEN: joi.string(),
      nameAR: joi.string(),
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
  file: generalFields.file,
};
