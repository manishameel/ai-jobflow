require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const resumeRoutes = require('./src/routes/resumeRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const gmailRoutes = require('./src/routes/gmailRoutes');
const emailRoutes = require('./src/routes/emailRoutes');


const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://ai-jobflow.vercel.app']
}));
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/emails', emailRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});