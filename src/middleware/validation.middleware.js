import { Types } from "mongoose";
export const objectIdValidation = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message("Invalid ObjectId");
};

export const validation = (schema) => {
  return (req, res, next) => {
    const data = {...req.body,...req.query,...req.params,...req.userdata };
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      const erroeMessage = validationResult.error.details.map((obj) => {
        return obj.message;
      });
      return next(new Error(erroeMessage));
    }
    return next();
  };
};
