const express = require("express");
const router = express.Router();
const networkController = require("../controller/networkcontroller");

router.post("/send",networkController.sendReqs); // send connection request
router.get("/",networkController.getReqs); // get connection request
router.post("/acceptrequs/:id",networkController.acceptReqs); // accept connection request
router.post("/rejectreqs/:id",networkController.rejectReqs); // reject connection request

module.exports = router;