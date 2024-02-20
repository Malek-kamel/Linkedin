import { Router } from "express";
import * as companyCon from "./company.controller.js";
import { asyncHandeler } from "../../utils/asyncHandelr.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { addCompany, updateCampany } from "./company.schema.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();

//////////////// Add Company //////////////////////
router.post(
  "/add",
  validation(addCompany),
  isAuth,
  asyncHandeler(companyCon.addCompany)
);

//////////////// update Company //////////////////////

router.patch(
  "/update/:id",
  validation(updateCampany),
  isAuth,
  asyncHandeler(companyCon.updateCompany)
);

// //////////////// Delete Company //////////////////////

router.delete("/delete/:id", isAuth, companyCon.deleteCompany);

// //////////////// Get company data //////////////////////

router.get("/company_data/:id", isAuth, companyCon.companyData);

/////////////////// Search for a company with a name ////////////////////

router.get("/search", isAuth, companyCon.searchCompany);

// //////////////// all applications for specific Jobs ////////////////////
router.get(
  "/applications_Jobs/:jobId",
  isAuth,
  asyncHandeler(companyCon.appJob)
);

export default router;
