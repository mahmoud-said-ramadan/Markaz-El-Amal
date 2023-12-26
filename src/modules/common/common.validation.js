import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
const updatePatient = {
  body: joi
    .object({
      name: joi.string(),
      phone: generalFields.phone,
    })
    .required(),
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
  // file: generalFields.file.required(),
};

const updateDoctor = {
  body: joi
    .object({
      name: joi.string(),
      phone: generalFields.phone,
      bio: joi.string(),
      consultationFee: joi.number().min(1),
    })
    .required(),
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
  file: generalFields.file,
};

export const update = (req) => {
  if (req.originalUrl.includes("/doctor")) {
    return updateDoctor;
  }
  return updatePatient;
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

// export const deletePatient = {
//   body: joi.object({}).required(),
//   params: joi.object({}).required(),
//   query: joi
// .object({
//   ln: generalFields.ln.required(),
// })
// .required(),
// };

// export const deleteDoctor = {
//   body: joi.object({}).required(),
//   params: joi.object({}).required(),
//   query: joi
// .object({
//   ln: generalFields.ln.required(),
// })
// .required(),
// };

export const changePassword = {
  body: joi
    .object({
      newPassword: generalFields.password.required(),
      oldPassword: generalFields.id.required(),
    })
    .required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const changeEmail = {
  body: joi
    .object({
      email: generalFields.email.required(),
    })
    .required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const confirmChangeEmail = {
  body: joi
    .object({
      newEmail: generalFields.email.required(),
      code: generalFields.code.required(),
      token: joi.string().required(),
    })
    .required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};

export const logout = {
  body: joi.object({}).required(),
  params: joi.object({}).required(),
  query: joi
    .object({
      ln: generalFields.ln.required(),
    })
    .required(),
};
