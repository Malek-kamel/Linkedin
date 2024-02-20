import { User } from "../../../DB/models/user.model.js";
import { Company } from "../../../DB/models/company.model.js";
import { Job } from "../../../DB/models/job.model.js";
import { Application } from "../../../DB/models/application.model.js";

// //////////////// Add Company //////////////////////

export const addCompany = async (req, res, next) => {
  const user = await User.findById(req.userdata);
  if (!user) return next(new Error("user not found"));

  if (user.role !== "Company_HR") return next(new Error("you are not HR !!"));
  const company = await Company.create({
    ...req.body,
    companyHR: req.userdata.id,
  });

  return res.json({ success: true, message: "done", company });
};

// ////////////// update Company /////////////////////

export const updateCompany = async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findById(id);
  if (!company) return next(new Error("company not found"));
  if (company.companyHR.toString() !== req.userdata.id.toString())
    return next(new Error("you are not the owner"));
  company.companyName = req.body.companyName;
  company.description = req.body.description;
  company.industry = req.body.industry;
  company.address = req.body.address;
  company.numberOfEmployees = req.body.numberOfEmployees;
  company.companyEmail = req.body.companyEmail;

  await company.save();

  return res.json({ success: true, message: "done", company });
};

//////////////// Delete Company //////////////////////

export const deleteCompany = async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findById(id);
  if (!company) return next(new Error("company not found"));

  if (company.companyHR.toString() !== req.userdata.id.toString())
    return next(new Error("you are not the owner"));

  await Company.findOneAndDelete(id);

  return res.json({ success: true, message: "done" });
};

////////////////// Get company data //////////////////////
export const companyData = async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    return next(new Error("company not found"));
  }

  // Find all jobs related to the company
  const jobs = await Job.find({ companyId: id });

  return res.json({ success: true, company, jobs });
};

///////////////// Search for a company with a name //////////////////

export const searchCompany = async (req, res, next) => {
  const { name } = req.query;
  const company = await Company.find(
    { companyName: { $regex: name, $options: "i" } },
    { companyHR: 0, _id: 0 }
  );
  if (company.length == 0) return next(new Error("comoany not found !"));

  return res.json({ success: true, message: "done", company });
};

// //////////////// all applications for specific Jobs ////////////////////

export const appJob = async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (job.addedBy.toString() !== req.userdata.id)
    return next(new Error("you are not the owner !"));
  // const userData = await
  const app = await Application.find({ jobId }).populate([
    {
      path: "userId",
      select: ["firstName", "lastName", "email", "mobileNumber"],
    },
  ]);

  return res.json({ success: true, message: "done", app });
};
