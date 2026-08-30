const prisma = require('../config/db');
const { extractTextFromPdfUrl } = require('../services/pdfService');
const { extractSkillsFromResume } = require('../services/geminiService');

async function uploadResume(req,res){
    try {
        if(!req.file){
            return res.status(400).json({message: 'No file uploaded'});
        }

        const fileUrl = req.file.path;
        const userId = req.userId;

        const newResume = await prisma.resume.create({
            data: {
                fileUrl: fileUrl,
                userId: userId
            }
        });

        res.status(201).json({
            message: 'Resume uploaded successfully',
            resume: newResume
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

async function getMyResumes(req,res){
    try {
        const userId = req.userId;

        const resumes = await prisma.resume.findMany({
            where: {userId: userId},
            orderBy: {uploadedAt: 'desc'}
        });

        res.status(200).json({resumes: resumes});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

async function parseResume(req, res) {
  try {
    const resumeId = parseInt(req.params.id);

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const rawText = await extractTextFromPdfUrl(resume.fileUrl);

    const aiData = await extractSkillsFromResume(rawText);

    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        rawText: rawText,
        skills: aiData.skills,
        experienceYrs: aiData.experienceYrs
      }
    });

    res.status(200).json({
      message: 'Resume parsed successfully',
      resume: updatedResume
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {uploadResume,getMyResumes, parseResume};