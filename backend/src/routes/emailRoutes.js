const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { syncEmails } = require('../controllers/emailController');

router.post('/sync', verifyToken, syncEmails);

module.exports = router;