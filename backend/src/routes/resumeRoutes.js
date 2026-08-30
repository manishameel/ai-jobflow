const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const {verifyToken} = require('../middleware/authMiddleware');
const {uploadResume, getMyResumes, parseResume} = require('../controllers/resumeController');


router.post('/parse/:id', verifyToken, parseResume);

router.post('/upload', verifyToken,upload.single('resume'), uploadResume);
router.get('/my-resumes', verifyToken, getMyResumes);

module.exports = router;