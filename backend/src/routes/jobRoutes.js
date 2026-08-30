const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/authMiddleware');
const {createJob, getAllJobs, getJobById } = require('../controllers/jobController');


router.post('/', verifyToken, createJob);
router.get('/', getAllJobs);
router.get('/',getJobById);

module.exports = router;