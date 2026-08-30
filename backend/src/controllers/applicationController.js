const prisma = require('../config/db');
const { matchResumeToJob } = require('../services/geminiService');

async function createApplication(req, res) {
  try {
    const userId = req.userId;
    const jobId = parseInt(req.body.jobId);
    const resumeId = parseInt(req.body.resumeId);

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const matchResult = await matchResumeToJob(
      resume.skills,
      job.description,
      job.requiredSkills
    );

    const newApplication = await prisma.application.create({
      data: {
        userId: userId,
        jobId: jobId,
        resumeId: resumeId,
        matchScore: matchResult.matchScore,
        missingSkills: matchResult.missingSkills
      }
    });

    res.status(201).json({
      message: 'Application created successfully',
      application: newApplication,
      aiInsights: {
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        suggestion: matchResult.suggestion
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMyApplications(req, res) {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId: userId },
      include: {
        job: true,
        resume: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.status(200).json({ applications: applications });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const applicationId = parseInt(req.params.id);
    const status = req.body.status;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status }
    });

    res.status(200).json({
      message: 'Status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createApplication, getMyApplications, updateApplicationStatus };