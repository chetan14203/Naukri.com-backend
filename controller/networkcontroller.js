const {Network} = require("../models/networkModels");

const sendReqs = async (req,res) => {
    try{
        const requestedId = req.user._id;
        const receiverId = req.user._id;
        if(!recieverId){
            return res.status(404).json({message : "Reciever is not found."});
        }
        const exist = await Network.findOne({user : requestedId,connection : receiverId});
        if(!exist){
            return res.status(400).json({message : "Request is already sent."});
        }
        let newReqs = Network({
            user : requestedId,
            connection : receiverId
        });
        newReqs = await newReqs.save();
        return res.json({message : "Request is sent."});
    }catch(error){
        console.log(error.message);
        return res.status(500).json({message : "Something went Wrong."});
    }
}

const getReqs = async (req,res) => {
    try{
        const userId = req.user._id;
        const get = await Network.findOne({connection : userId}).populate('user');
        if(!get){
            return res.status(404).json({message : "No requests to show."});
        }
        return res.json(get);
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message :"Something went Wrong."});
    }
}

const acceptReqs = async (req,res) => {
    try{
        const userId = req.user._id;
        const recieverId = req.params.id;
        const networkReqs = await Network.findOne({user : userId,connection : recieverId});
        if(!networkReqs){
            return res.status(404).json({message : "Request is not found."});
        }
        networkReqs.status = 'accepted';
        await networkReqs.save();
        return res.json({message :"Request is accepted."});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message :"Something went Wrong."});
    }
}

const rejectReqs = async (req,res) => {
    try{
        const userId = req.user._id;
        const recieverId = req.params.id;
        const networkReqs = await Network.findOne({user:userId,connection:recieverId});
        if(!networkReqs){
            res.status(404).json({message:"Request is not found"});
        }
        networkReqs.status = 'rejected';
        await networkReqs.save();
        return res.json({message : "Request is rejected."});
    }catch(error){
        console.log(error.message);
        res.status(500).json({message : "Something went wrong."});
    }
}

module.exports = {sendReqs,getReqs,acceptReqs,rejectReqs};