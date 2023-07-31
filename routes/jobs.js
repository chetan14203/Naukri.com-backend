const express = require("express");
const router = express.Router();

const {getjob,getjobbyId,postJob,updateJob,jobDelete} = require("../controller/joblistingController");

router.get("/getjob",getjob);
router.get("/:id",getjobbyId);
router.post("/",postJob);
router.put("/update/:id",updateJob);
router.delete("/delete/:id",jobDelete);

module.exports = router;