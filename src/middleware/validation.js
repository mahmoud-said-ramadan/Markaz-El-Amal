import joi from "joi";
import { Types } from "mongoose";
const dataMethods = ["body", "params", "query", "headers", "files", "file"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};
export const generalFields = {
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 4,
    tlds: { allow: ["com", "net"] },
  }),
  password: joi
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    ),
  cPassword: joi.string(),
  code: joi.string().regex(/^[0-9]{5}$/),
  id: joi.string().custom(validateObjectId),
  phone: joi
    .string()
    .trim()
    .pattern(/^01[0-2,5]{1}[0-9]{8}$/),
  file: joi
    .object({
      size: joi.number().positive(),
      path: joi.string(),
      filename: joi.string(),
      destination: joi.string(),
      mimetype: joi.string(),
      encoding: joi.string(),
      originalname: joi.string(),
      fieldname: joi.string(),
    })
    .messages({
      "any.required": "files is required",
    }),
  ln: joi.string().valid("en", "ar").required().messages({
    "any.required": "Language is required.",
    "string.base": "Language must be a string.",
    "any.only": 'Language must be either "en" or "ar".',
  }),
};

export const validateId = {
  body: joi.object({}).required(),
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
export const validation = (schema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error.details);
        }
      }
    });

    if (validationErr.length) {
      return res.json({ message: "Validation Err", validationErr });
    }
    return next();
  };
};
