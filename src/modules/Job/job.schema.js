import joi from "joi";
import { objectIdValidation } from "./../../middleware/validation.middleware.js";

export const addJob = joi
  .object({
    id: joi.custom(objectIdValidation),
    jobTitle: joi.string().required(),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    addedBy: joi.custom(objectIdValidation),
  })
  .required();

export const jobsFilter = joi.object({
  jobTitle: joi.string(),
  jobLocation: joi.string(),
  workingTime: joi.string(),
  seniorityLevel: joi.string(),
  technicalSkills: joi.array().items(joi.string()),
});

