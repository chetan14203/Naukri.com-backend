const express = require("express");
const router = express.Router();
const auth = require("../middlewear/auth");
const jobController = require("../controller/joblistingController");
const checklimit = require("../middlewear/jobspost");

router.get("/getjob",auth,jobController.getJobs);
router.get("/:id",auth,jobController.getJobById);
router.post("/",auth,checklimit,jobController.createJob);
router.put("/update/:id",auth,jobController.updateJob);
router.delete("/delete/:id",auth,jobController.deleteJob);

module.exports = router;