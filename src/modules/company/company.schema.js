import joi from "joi";
import { objectIdValidation } from "./../../middleware/validation.middleware.js";

export const addCompany = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string().email().required(),
  })
  .required();

export const updateCampany = joi
  .object({
    id: joi.custom(objectIdValidation),
    companyName: joi.string().required(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string().email().required(),
  })
  .required();


