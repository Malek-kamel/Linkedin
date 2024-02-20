import { Router } from "express";
import * as Jc from "./job.controller.js";
import { asyncHandeler } from "./../../../src/utils/asyncHandelr.js";
import { isAuth } from "../../middleware/auth.middleware.js";
import { validation } from "./../../middleware/validation.middleware.js";
import { addJob, jobsFilter } from "./job.schema.js";
import { uploadFileCloud } from "../../utils/multerCloud.js";
const router = Router();

///////////////////  add job /////////////////

router.post(
  "/add",
  // validation(addJob),
  isAuth,
  asyncHandeler(Jc.addJob)
);

///////////////////  update job /////////////////

router.patch(
  "/update/:id",
  validation(addJob),
  isAuth,
  asyncHandeler(Jc.updateJob)
);

///////////////////  delete job /////////////////
router.delete("/delete/:id", isAuth, asyncHandeler(Jc.deleteJob));

///////////////////  job info /////////////////
router.get("/job_info", isAuth, asyncHandeler(Jc.jobInfo));

/////////  Jobs for a specific company ///////

router.get("/Jobs_specific", isAuth, asyncHandeler(Jc.jobsSpecific));

//////// all Jobs that match the following filters ////

router.get(
  "/Jobs_filter",
  validation(jobsFilter),
  isAuth,
  asyncHandeler(Jc.jobsFilter)
);

////////   Apply to Job   ///////

router.post(
  "/apply_job/:jobId",
  isAuth,
  uploadFileCloud().single("cv"),
  asyncHandeler(Jc.applyJob)
);

export default router;
