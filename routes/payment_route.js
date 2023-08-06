const express = require("express");
const router = express();

const paymentController = require("../controller/paymentController");

router.post("/",paymentController.createOrder);
router.post("/success",paymentController.paymentSuccess);
router.post("/refund",paymentController.paymentRefund);

module.exports = router;