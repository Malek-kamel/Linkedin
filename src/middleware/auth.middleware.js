import { User } from "../../DB/models/user.model.js";
import { asyncHandeler } from "../utils/asyncHandelr.js";

import jwt from "jsonwebtoken";

export const isAuth = asyncHandeler(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new Error("token missing"));
  if (!token.startsWith(process.env.BEARER_KEY))
    return next(new Error("Invalid Token !!"));
  token = token.split(process.env.BEARER_KEY)[1];

  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  const isUser = await User.findById(payload.id);
  if (!isUser) return next(new Error("user not found"));
  if (isUser.logout === true) return next(new Error("Please login first !!"));
  req.userdata = isUser;

  return next();
});

