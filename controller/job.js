const Job = require("../model/Job");
const User = require("../model/User");
const createJob = async (req, res, next) => {
  const position = req.body.position;
  const company = req.body.company;
  const location = req.body.jobLocation;
  const status = req.body.status;
  const jobType = req.body.jobType;
  const userId = req.params.userId;
  // console.log(userId);
  User.findById(userId).then((user) => {
    if (!user) {
      const error = new Error("unauthorize user");
      throw error;
    }
    const job = new Job({
      position: position,
      company: company,
      jobLocation: location,
      status: status,
      jobType: jobType,
    });
    job
      .save()
      .then(async (job) => {
        user.jobs.push(job);
        await user.save();
        job.createdBy.push(req.userId);
        await job.save();
        return res.status(200).json({ message: "job created", job: job });
      })
      .catch((err) => {
        throw err;
      });
  });
};
const deleteJob = (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.params.userId;
  console.log(jobId);
  Job.findById(jobId).then((job) => {
    if (job) {
      job.deleteOne();
      // job.save();
    }
  });
  User.findById(userId)
    .then((user) => {
      let index = user.jobs.findIndex(jobId);
      user.jobs.splice(index, 1);
      user.save();
      res.status(200).json({ message: "job deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
  // Job.save();
};
const getAllJob = (req, res, next) => {
  const userId = req.userId;
  const searchStatus = req.query.status;
  const sort = req.query.sort;
  const page = req.query.page || 1;
  const searchType = req.query.jobType;
  const search = req.query.search;

  const query = { createdBy: { $eq: userId } };
  if (search) {
    query.position = { $regex: search, $options: "i" };
  }
  if (searchStatus && searchStatus !== "all") {
    query.status = searchStatus;
  }

  if (searchType && searchType !== "all") {
    query.jobType = searchType;
  }
  if (searchStatus == "all" && searchType == "all") {
    delete query.status, delete query.jobType;
  }

  Job.find(query)
    .populate("createdBy")
    .then((jobs) => {
      if (jobs) {
        // console.log(jobs);
        let tempArray;
        if (sort == "latest") {
          tempArray = [];
          for (var i = jobs?.length - 1; i >= 0; i--) {
            tempArray.push(jobs[i]);
          }
          return res.status(200).json({
            jobs: tempArray,
            totalJobs: tempArray.length,
            numOfPages: page,
          });
        }
        if (sort == "oldest") {
          tempArray = [];
          for (var i = 0; i < jobs?.length; i++) {
            tempArray.push(jobs[i]);
          }
          return res.status(200).json({
            jobs: tempArray,
            totalJobs: tempArray.length,
            numOfPages: page,
          });
        }
        if (sort == "a-z") {
          tempArray = [...jobs];
          tempArray.sort(function (a, b) {
            // console.log(a.position,b.position);
            let x = a.position.toUpperCase();
            let y = b.position.toUpperCase();
            return x == y ? 0 : x > y ? 1 : -1;
          });
          // console.log(jobs);
          return res.status(200).json({
            jobs: tempArray,
            totalJobs: tempArray.length,
            numOfPages: page,
          });
        }
        if (sort == "z-a") {
          tempArray = [...jobs];
          tempArray.sort(function (a, b) {
            let x = a.position.toUpperCase();
            let y = b.position.toUpperCase();
            return x == y ? 0 : x < y ? 1 : -1;
          });
          return res.status(200).json({
            jobs: tempArray,
            totalJobs: tempArray.length,
            numOfPages: page,
          });
        }

        //  return res
        //     .status(200)
        //     .json({ jobs: jobs, totalJobs: jobs.length, numOfPages: page });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const showStats = async (req, res, next) => {
  const userId = req.userId;
  // console.log(userId);
  let pendingCount = 0;
  let interviewCount = 0;
  let declinedCount = 0;
  User.findById(userId)
    .populate("jobs")
    .then((user) => {
      // console.log("ghg",user.jobs.filter(job=>job.status=="pending"));
      user.jobs.forEach((job) => {
        if (job?.status == "pending") {
          pendingCount += 1;
        } else if (job?.status == "interview") {
          interviewCount += 1;
        } else if (job?.status == "declined") {
          declinedCount += 1;
        }
      });
      return res.status(200).json({
        defaultStats: {
          pending: pendingCount,
          interview: interviewCount,
          declined: declinedCount,
        },
        monthlyApplications: [
          {
            pending: pendingCount,
            interview: interviewCount,
            declined: declinedCount,
            date: new Date().getDate(),
          },
        ],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const editJob = (req, res, next) => {
  const jobId = req.params.jobId;
  // console.log(jobId);
  Job.findById(jobId)
    .then(async (job) => {
      const position = req.body.position;
      const company = req.body.position;
      const jobLocation = req.body.jobLocation;
      const status = req.body.status;
      const jobType = req.body.jobType;
      job.position = position;
      job.company = company;
      job.status = status;
      job.jobType = jobType;
      job.jobLocation = jobLocation;
      const updatedJob = await job.save();
      //  console.log(updatedJob);
      return res.status(200).json({
        message: "edited sucessfully",
        job: updatedJob,
        jobId: job._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
const getSeekJob = (req, res, next) => {
  // console.log("k",req.userId);
  const userId = req.userId;
  Job.find({ createdBy: { $ne: userId } })
    .then((result) => {
      // console.log(result);
      return res.status(200).json({ jobs: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAppliedJobsId = (req, res, next) => {
  const job_Id = req.params.jobId;

  Job.findById(job_Id)
    .populate("createdBy")
    .then((job) => {
      job.appliedBy.push(req.userId);
      job.save();
      User.findById(job.createdBy[0]._id).then(async (user) => {
        let jobExists = false;
        for (let j of user.appliedJobs) {
          if (j._id.equals(job._id)) {
            jobExists = true;
            break;
          }
        }
        if (!jobExists) {
          user.appliedJobs.push(job);
          await user.save();
        }

        User.findById(req.userId).then(async (user) => {
          let jobExists = false;
          for (let j of user.myJobs) {
            if (j._id.equals(job._id)) {
              jobExists = true;
              break;
            }
          }
          if (!jobExists) {
            user.myJobs.push(job);

            await user.save();

            return res.status(200).json({ message: "applied succesfully!!" });
          } else {
            res.status(500).json({ errorMessage: "failed to apply" });
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postStatus = (req, res, next) => {
  const status = req.params.key;
  const jobId = req.params.jobId;
  // console.log(status);
  Job.findById(jobId)
    .then((job) => {
      job.status = status;
      return job.save();
    })
    .then((updatedJob) => {
      return User.findById(updatedJob.createdBy[0]._id).populate("appliedJobs");
    })
    .then((user) => {
      const appliedJob = user.appliedJobs.find(
        (job) => job._id.toString() === jobId.toString()
      );
      if (appliedJob) {
        appliedJob.status = status;
        // console.log(appliedJob);
        user.save();
        res
          .status(200)
          .json({ message: "updated status", appliedJob: appliedJob });
      } else {
        const error = new Error("appliedjob not found");
        throw error;
      }
    })
    .catch((err) => {
      throw err;
    });
};
const getAppliedJobs = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId)
    .populate("myJobs")
    .populate({
      path: "appliedJobs",
      populate: { path: "appliedBy" }, // Nested population to get the user who applied for each job
    })
    .then((user) => {
      res.status(200).json({ appliedJobs: user.appliedJobs });
    })
    .catch((err) => {
      // Handle errors
      res.status(500).json({ error: "An error occurred while fetching data" });
    });
};

const getmyJob = async (req, res, next) => {
  // const userId = req.userId;
  // const jobId = req.params.jobId;
  User.findById(req.userId)
    .populate("myJobs")
    .then((user) => {
      const myJobs = user.myJobs;
      return res.status(200).json({ myJobs: myJobs });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  createJob,
  deleteJob,
  getAllJob,
  showStats,
  editJob,
  getSeekJob,
  getAppliedJobsId,
  getAppliedJobs,
  postStatus,
  getmyJob,
};
