const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/authMiddleware');
const {createApplication, getMyApplications, updateApplicationStatus} = require('../controllers/applicationController');


router.post('/', verifyToken, createApplication);
router.get('/my-applications', verifyToken, getMyApplications);
router.patch('/:id/status', verifyToken, updateApplicationStatus);

module.exports = router;