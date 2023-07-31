const {JOBLIST} = require("../models/joblisting");
const {Employer} = require("../models/employer");

const getjob = async (req,res) => {
    const job = await JOBLIST.find();
    if(!job){
        res.status(404).json(`Jobs are not available.`)
    }
    res.status(200).json(job);
}

const getjobbyId = async(req,res) => {
    const id = req.params.id;
    const jobId = await JOBLIST.findById({
        "$or" : [
            {companyName : {$regex : id}},
            {postName : {$regex : id}},
            {location : {$regex : id}}
        ]
    });
    if(!jobId){
        res.status(404).json("Jobs are not found.");
    }
    res.status(200).json(jobId);
}

const postJob = async (req,res) => {
    const employer = await Employer.findById(req.body.employer);
    if(!employer){
        res.status(404).json("Invalid Employer.");
    }
    let newJob = new JOBLIST({
        employer : req.body.employer,
        companyName : req.body.companyName,
        postName : req.body.postName,
        location : req.body.location,
        jobDescription : req.body.jobDescription,
        otherDetails : req.body.otherDetails
    })
    newJob = await newJob.save();
    if(!newJob){
        res.status(404).json('Invalid Job.');
    }
    res.status(200).json(newJob);
}

const updateJob = async (req,res) => {
    const Jobupdate = await JOBLIST.findByIdAndUpdate(req.params.id,{
        employer : req.body.employer,
        companyName : req.body.companyName,
        postName : req.body.postName,
        location : req.body.location,
        jobDescription : req.body.jobDescription,
        otherDetails : req.body.otherDetails
    }, {new : true});
    if(!Jobupdate){
        res.status(404).json("Invalid Job");
    }
    res.status(200).json(Jobupdate);
}

const jobDelete = async (req,res) => {
    const job = await JOBLIST.findByIdAndRemove(req.params.id);
    if(!job){
        res.status(404).json("Invalid Job.");
    }
    res.status(200).json("Job is deleted.");
}

module.exports = {getjob,getjobbyId,postJob,updateJob,jobDelete};