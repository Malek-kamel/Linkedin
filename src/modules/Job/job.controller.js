import { Application } from "../../../DB/models/application.model.js";
import { Job } from "../../../DB/models/job.model.js";
import { Company } from "./../../../DB/models/company.model.js";
import { User } from "./../../../DB/models/user.model.js";
import cloudinary from "./../../utils/cloud.js";

///////////////////  add job /////////////////

export const addJob = async (req, res, next) => {
  const user = await User.findById(req.userdata);
  if (req.userdata.role !== "Company_HR")
    return next(new Error("you are not HR !!"));
  if (!user) return next(new Error("user not found"));

  const company = await Company.findById(req.body.companyId);

  if (company.companyHR.toString() !== req.userdata.id)
    return next(new Error("you are not HR this company"));
  const job = await Job.create({
    ...req.body,
    addedBy: req.userdata.id,
  });

  return res.json({ success: true, message: "done", job });
};

///////////////////  update job /////////////////

export const updateJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return next(new Error("job not found"));
  if (job.addedBy.toString() !== req.userdata.id.toString())
    return next(new Error("you are not the owner"));

  job.jobTitle = req.body.jobTitle;
  job.jobLocation = req.body.jobLocation;
  job.workingTime = req.body.workingTime;
  job.seniorityLevel = req.body.seniorityLevel;
  job.jobDescription = req.body.jobDescription;
  job.technicalSkills = req.body.technicalSkills;
  job.softSkills = req.body.softSkills;
  await job.save();

  return res.json({ success: true, message: "done", job });
};

///////////////////  delete job /////////////////

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return next(new Error("job not found"));
  if (job.addedBy.toString() !== req.userdata.id.toString())
    return next(new Error("you are not the owner"));
  await Job.findByIdAndDelete(id);

  return res.json({ success: true, message: "done" });
};

///////////////////  job info /////////////////

export const jobInfo = async (req, res, next) => {
  const job = await Job.find().populate([
    {
      path: "companyId",
      select: ["companyName", "description", "email", "companyEmail"],
    },
  ]);

  if (job.length == 0) return next(new Error("No job available!!"));

  return res.json({ success: true, results: { job } });
};

/////////  Jobs for a specific company ///////
export const jobsSpecific = async (req, res, next) => {
  const { name } = req.query;
  const isCompany = await Company.findOne({ companyName: name });
  if (!isCompany) return next(new Error("company not found"));

  const job = await Job.find({ companyId: isCompany });
  if (job.length == 0) return next(new Error("No job available!!"));

  return res.json({ success: true, results: { job } });
};

//////// all Jobs that match the following filters ////

export const jobsFilter = async (req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;

  const job = await Job.find({
    $or: [
      { workingTime: workingTime },
      { jobLocation: jobLocation },
      { seniorityLevel: seniorityLevel },
      { jobTitle: jobTitle },
      { technicalSkills },
    ],
  });
  if (job.length == 0) return next(new Error("No job available!!"));

  return res.json({ success: true, results: { job } });
};

///////   Apply to Job   /////

export const applyJob = async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) return next(new Error("job not found"));

  const user = await User.findById(req.userdata);
  if (req.userdata.role !== "User")
    return next(new Error("HR company can not apply this job !!"));
  if (!user) return next(new Error("user not found"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `users/${req.userdata.id}userResume/`,
    }
  );

  console.log(applyBefor)
  const app = await Application.create({
    ...req.body,
    jobId,
    userId: req.userdata.id,
    userResume: { secure_url, public_id },
  });

  return res.json({ success: true, message: "done", app });
};
