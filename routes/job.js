const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const {
  createJob,
  deleteJob,
  getAllJob,
  showStats,
  editJob,
  getSeekJob,
  getAppliedJobsId,
  getAppliedJobs,
  postStatus,
  getmyJob
} = require("../controller/job");
const router = Router();
router.post("/jobs/:userId", isAuth, createJob);
// jobs?status=${searchStatus}&sort=${sort}&page=${page}&jobType=${searchType}/${userId}
router.delete("/jobs/:userId/:jobId", isAuth, deleteJob);
// router.get('/demo/stats',showStats);
router.get("/jobs/stats", isAuth, showStats);
router.get("/jobs/:userId", isAuth,getAllJob);
router.patch("/jobs/:jobId", isAuth, editJob);
router.get("/jobSeek",isAuth,getSeekJob);
router.get('/applied-jobs/:jobId',isAuth,getAppliedJobsId);
router.get('/applied-jobs',isAuth,getAppliedJobs);
router.post('/update-status/demo/:key/:jobId',isAuth,postStatus);
router.get('/my-job',isAuth,getmyJob);
module.exports = router;
