const prisma = require('../config/db');

async function createJob(req,res){
    try {
        const title = req.body.title;
        const company = req.body.company;
        const description = req.body.description;
        const requiredSkills = req.body.requiredSkills;
        const location = req.body.location;

        const newJob = await prisma.job.create({
            data: {
                title: title,
                company: company,
                description: description,
                requiredSkills: requiredSkills,
                location: location
            }
        });

        res.status(201).json({
            message: 'Job created successfully',
            job: newJob
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

async function getAllJobs(req,res){
    try {
        const jobs = await prisma.job.findMany({
            orderBy: {createdAt: 'desc'}
        });

        res.status(200).json({jobs: jobs});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

async function getJobById(req,res){
    try {
        const jobId = parseInt(req.params.id);

        const job = await prisma.job.findUnique({
            where: {id: jobId}
        });

        if(!job){
            return res.status(404).json({message: 'Job not found'});
        }

        res.status(200).json({job: job});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

module.exports = { createJob, getAllJobs, getJobById };