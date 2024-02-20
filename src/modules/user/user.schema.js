import joi from "joi";

//////// signup Schema ////////
export const signupSchema = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    recoveryEmail: joi.string().required(),
    DOB: joi.date(),
    mobileNumber: joi.string().required(),
    role: joi.string(),
  })
  .required();

  //////// login Schema ////////

export const loginSchema = joi
  .object({
    email: joi.string().email(),
    mobileNumber: joi.string(),
    password: joi.string().required(),
  })
  .required();


    //////// update Schema ////////

export const updateSchema = joi
  .object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),
    DOB: joi.date(),
    mobileNumber: joi.string(),
  })
  .required();

export const forGetCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    code: joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  })
  .required();

export const changePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
  })
  .required();


  export const recoveryEmailschema = joi
    .object({
      email: joi.string().email().required(),
    })
    .required();
