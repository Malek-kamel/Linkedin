import { Router } from "express";
import * as Uc from "./user.controller.js";
import { asyncHandeler } from "./../../../src/utils/asyncHandelr.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { validation } from "./../../middleware/validation.middleware.js";
import {
  loginSchema,
  signupSchema,
  updateSchema,
  forGetCode,
  resetPassword,
  changePassword,
  recoveryEmailschema,
} from "./user.schema.js";

const router = Router();
/////////////////// signup ///////////////////////
router.post("/signup", validation(signupSchema), asyncHandeler(Uc.signup));
// router.post("/profile_pc",uploadFile().single("pp"),asyncHandeler(Uc.profilePc))

/////////////////// login ///////////////////////

router.post("/login", validation(loginSchema), asyncHandeler(Uc.login));

////////////////account activtion///////////////////////
router.get("/account_activtion/:token", Uc.accountActivtion);

/////////////////// updateuser ///////////////////////

router.patch(
  "/updateuser",
  validation(updateSchema),
  isAuth,
  asyncHandeler(Uc.updateUser)
);


/////////////////// ForGet Code ///////////////////////

router.patch("/forget_code", validation(forGetCode), Uc.forGetCode);


//////////delete   user  //////////

router.delete("/deleteuser", isAuth, asyncHandeler(Uc.deleteUser));


//////////Get user account data  //////////
router.get("/accountdata",isAuth,asyncHandeler(Uc.userAccountData ));

//////////Get profile data for another user   //////////
router.get("/anotheruser/:id", isAuth, asyncHandeler(Uc.anotherUserData));

/////////////////// forgetPassword ///////////////////////

router.patch(
  "/forget_password",
  validation(resetPassword),
  asyncHandeler(Uc.forgetPassword)
);

/////////////////// Update password ///////////////////////

router.patch(
  "/changepass",
  validation(changePassword),
  isAuth,
  asyncHandeler(Uc.updatePassword)
);


////////////////// LogOut ///////////////////

router.patch("/logout", isAuth, asyncHandeler(Uc.logOut));

/////////////////  specific recovery Email  //////

router.get(
  "/specific_Re_email",
  validation(recoveryEmailschema),
  asyncHandeler(Uc.specificRecoveryEmail)
);

export default router;
