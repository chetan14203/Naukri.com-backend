const razorpay = require('razorpay');
const {Payment} = require("../models/paymentModels");
require('dotenv').config();

var razorparinstance = new razorpay({
    key_id : process.env.keyid,
    key_secret : process.env.keysecret
});

const createOrder = async (req,res) => {
    try{
        var options = {
            amount : 20000,
            currency : "INR",
            receipt : "rcp1"
        };
        instance.orders.create(options,function(err,order){
            console.log(err.message);
            res.send({orderId : order.id});
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json("Payment is Failed.");
    }
}

const paymentSuccess = async (req,res) => {
    try{
        const userId = req.user.id;
        const { razorpay_payment_id, amount } = req.body;
        const payment = new Payment({
            _id: userId,
            paymentid: razorpay_payment_id,
            amount: amount,
            date : Date.now(),
            success: "Success",
        });
        await payment.save();
        return res.json({message : "Payment is Successful."});
    }catch(error){
        console.log(error.message);
        return res.status(500).json("Something went wrong.");
    }
}

const paymentRefund = async (req,res) => {
    try{
        const user = await Payment.findOne({_id:req.params.id});
        const paymentid = user.paymentid;
        const amount = user.amount;
        const refunddate = Date.now();
        if((refunddate-user.date) < 7){
            return res.json({message : "You cannot claim for refund."});
        }
        if(user.success != "Success"){
            return res.json({message : "You cannot claim for refund."});
        }
        razorpayinstance.payments.refund(paymentid, {
            amount: amount,
        },function (err, refund){
            if (err) {
              console.log(err.message);
              return res.status(500).json({ error: "Refund failed." });
            }
            console.log(refund);

            return res.json({ message: "Refund initiated successfully." });  
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json("Refund cannot be initiated.");
    }
}

const getPayment = async (req,res) => {
    try{
        const payment = await Payment.findOne(req.params.id);
        if(!payment){
            return res.json({message : "You have not done payment."});
        }
        return res.json(payment);
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message : "Something went wrong."});
    }
}

module.exports = {createOrder,paymentSuccess,paymentRefund,getPayment};