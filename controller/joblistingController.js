const {Job} = require("../models/joblisting");
const {User} = require("../models/users");

const getJobs = async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    try{
        const job = await Job.find()
             .populate('user')
             .skip((page-1) * itemsPerPage)
             .limit(itemsPerPage);
        if(!job){
            return res.json("No job is found.");
        }
        return res.json({
            job,
            currentPage: page,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            totalUsers: totalCount
        });
    }catch(error){
        console.log(error.message);
    }
}

const getJobById = async (req,res) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    try{
        const id = req.body.search;
        const job = await Job.find({
            "$or" :[
                {position : {$regex : id, $options : "i"}},
                {location : {$regex : id, $options : "i"}},
            ]
        })
           .populate('user')
           .skip((page-1) * itemsPerPage)
           .limit(itemsPerPage);
        return res.json({
            job,
            currentPage: page,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            totalUsers: totalCount
        });
    }catch(error){
        console.log(error.message);
    }
}

const createJob = async (req,res) => {
    try{
        const user = req.params.id;
        if(!user){
            return res.json("User is not registered.");
        }
        const admin = await User.findOne({_id:user}).isAdmin;
        if(!admin){
            return res.json("User can not post job.")
        }
        const {position,location,discription} = req.body;
        if(!position || !location || !discription){
            return res.json("All fields are required");
        }
        let newJob = Job({
            position : position,
            location : location,
            discription : discription
        })
        newJob = await newJob.save();
        return res.json("Job is posted.");
    }catch(error){
        console.log(error.message);
    }
}

const updateJob = async (req,res) => {
    try{
        const admin = await User.findOne({_id:req.params.id});
        if(!admin){
            return res.json("User cannot modify the job posting.");
        }
        const jobupdate = await Job.findByIdAndUpdate({_id : req.params.id},{
            position : req.body.position,
            location : req.body.location,
            discription : req.body.discription
        },{new : true});
        if(!jobupdate){
            return res.json("Job is not found.");
        }
        return res.json("Job is updated.");
    }catch(error){
        console.log(error.message);
    }
}

const deleteJob = async (req,res) => {
    try{
        const admin = await User.findOne({_id:req.params.id}).isAdmin;
        if(!admin){
            return res.json("User can not delete job.");
        }
        const jobdelete = await Job.findByIdAndRemove({_id:req.params.id});
        if(!jobdelete){
            return res.json("Job not found.")
        }
        return res.json("Job is deleted.");
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {getJobs,getJobById,createJob,updateJob,deleteJob};