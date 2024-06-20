const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userid }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userid;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const {
    user: { userid },
    params: { id: jobid },
  } = req;
  const job = await Job.findOne({ _id: jobid, createdBy: userid });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobid}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userid },
    params: { id: jobid },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("company or position cant be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobid, createdBy: userid },
    req.body,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userid },
    params: { id: jobid },
  } = req;
  const job = await Job.findByIdAndRemove({ _id: jobid, createdBy: userid });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobid}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
