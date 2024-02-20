import { User } from "./../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { asyncHandeler } from "../../utils/asyncHandelr.js";
import randomstring from "randomstring";

/////////////////// signup ///////////////////////

export const signup = async (req, res, next) => {
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) return next(new Error("Email already existed"));

  const hashPassword = bcryptjs.hashSync(
    req.body.password,
    process.env.SALT_ROUND
  );
  const user = await User.create({ ...req.body, password: hashPassword });
  const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET);
  const messageSent = await sendEmail({
    to: user.email,
    subject: "account activtion",
    html: `<a href=http://localhost:3000/user/account_activtion/${token}>account activtion</a>`,
  });
  if (!messageSent) return next(new Error("Invalid Email !!!!!!!!!!"));

  return res.json({ success: true, results: { user } });
};

////////////////account activtion//////////////////////////
export const accountActivtion = asyncHandeler(async (req, res, next) => {
  const { token } = req.params;
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  await User.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );
  return res.send("Account Activated successfuly");
});

/////////////////// login ///////////////////////

export const login = async (req, res, next) => {
  const isUser = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (!isUser) return next(new Error("email or mobileNumber is invalid !"));
  if (isUser.isConfirmed === false)
    return next(new Error("Please Active your account first !!"));

  const matchPassword = bcryptjs.compareSync(
    req.body.password,
    isUser.password
  );
  if (!matchPassword) return next(new Error("password is invalid !"));
  isUser.logout = false;
  await isUser.save();

  // genrate Token
  const token = jwt.sign(
    { id: isUser._id, email: isUser.email },
    process.env.TOKEN_SECRET
  );
  await Token.create({
    token,
    userId: isUser._id,
    role:isUser.role,
    agent: req.headers["user-agent"],
  });

  return res.json({ success: true, token });
};

/////////////////// update User ///////////////////////

export const updateUser = async (req, res, next) => {
  const { _id } = req.userdata;

  const userNewData = await User.findOne({
    $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }],
  });
  if (userNewData)
    return next(new Error("email or mobileNumber alrady exest!"));

  const isUser = await User.findOneAndUpdate(
    { _id },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      recoveryEmail: req.body.recoveryEmail,
      DOB: req.body.DOB,
    },
    { new: true }
  );
  if (!isUser) return next(new Error("user not found!"));

  return res.json({ success: true, message: " done", isUser });
};

/////////////////// delete User ///////////////////////

export const deleteUser = async (req, res, next) => {
  const { _id } = req.userdata;

  const user = await User.findOneAndDelete(_id);
  if (!user) return next(new Error("user not found"));

  return res.json({ success: true, message: "done" });
};

//////////Get user account data  //////////

export const userAccountData = async (req, res, next) => {
  const { _id } = req.userdata;

  const user = await User.findById(_id);
  if (!user) return next(new Error("user not found"));

  return res.json({ success: true, message: " done", user });
};

////////Get profile data for another user   //////////
export const anotherUserData = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne(
    { _id: id },
    { firstName: 1, lastName: 1, DOB: 1 }
  );
  if (!user) return next(new Error("user not found"));

  return res.json({ success: true, message: " done", user });
};

/////////////////// update Password ///////////////////////

export const updatePassword = async (req, res, next) => {
  const { email, password } = req.userdata;
  const { newPassword, oldPassword } = req.body;

  const isUser = await User.findOne({ email });

  if (!isUser) return next(new Error("email is invalid !"));
  if (oldPassword == newPassword)
    return next(new Error("The password matches the old password!!"));

  const matchPassword = bcryptjs.compareSync(oldPassword, password);
  if (!matchPassword) return next(new Error("password is invalid !!!"));
  const hashPassword = bcryptjs.hashSync(newPassword, 8);
  isUser.password = hashPassword;

  await isUser.save();

  return res.json({ success: true, message: "password changed success" });
};

/////////////////// forget code ///////////////////////

export const forGetCode = asyncHandeler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("user not found"));
  if (user.isConfirmed === false)
    return next(new Error("Please Active your account first !!"));
  const code = randomstring.generate({
    length: 5,
    charset: "numberic",
  });
  user.forgetCode = code;
  await user.save();
  const messageSent = await sendEmail({
    to: req.body.email,
    subject: "Reset Password",
    html: `<div>${code}</div>`,
  });
  if (!messageSent) return next(new Error("Email Invalid"));
  return res.send("you can reset you password now");
});

/////////////////// Forget password ///////////////////////

export const forgetPassword = asyncHandeler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("user not found"));

  if (user.forgetCode !== req.body.code) return next(new Error("Invalid Code"));
  user.password = bcryptjs.hashSync(req.body.password, 8);

  await user.save();
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({ success: true, message: "try to login now !" });
});

////////////////// LogOut ///////////////////

export const logOut = async (req, res, next) => {
  const { _id } = req.userdata;
  const isUser = await User.findOneAndUpdate({ _id }, { logout: true });
  if (!isUser) return next(new Error("user not found!"));

  return res.json({ success: true, message: " logout done " });
};

export const specificRecoveryEmail = async (req, res, next) => {
    const { recoveryEmail } = req.body;

    const user = await User.find({recoveryEmail:recoveryEmail},{firstName:1 , lastName:1,email:1});
    if (!user) return next(new Error("user not found"));

    return res.json({ success: true, message: " done", user });

};
