const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { connectGmail, gmailCallback } = require('../controllers/gmailController');

router.get('/connect', verifyToken, connectGmail);
router.get('/callback', gmailCallback);

module.exports = router;