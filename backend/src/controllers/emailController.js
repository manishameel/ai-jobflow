const prisma = require('../config/db');
const { fetchRecentEmails } = require('../services/gmailFetchService');
const { classifyEmail } = require('../services/geminiService');

async function syncEmails(req, res) {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user.gmailConnected || !user.gmailRefreshToken) {
      return res.status(400).json({ message: 'Gmail not connected' });
    }

    const emails = await fetchRecentEmails(user.gmailRefreshToken);

    const results = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      const existingEmail = await prisma.email.findFirst({
        where: { subject: email.subject, sender: email.sender }
      });

      if (existingEmail) {
        continue;
      }

      const classification = await classifyEmail(email.subject, email.sender, email.snippet);

      if (!classification.isJobRelated) {
        continue;
      }

      const matchedApplication = await prisma.application.findFirst({
        where: {
          userId: userId,
          job: {
            company: {
              contains: classification.companyName,
              mode: 'insensitive'
            }
          }
        }
      });

      const newEmailRecord = await prisma.email.create({
        data: {
          subject: email.subject,
          sender: email.sender,
          snippet: email.snippet,
          detectedType: classification.type,
          applicationId: matchedApplication ? matchedApplication.id : null
        }
      });

      if (matchedApplication) {
        await prisma.application.update({
          where: { id: matchedApplication.id },
          data: { status: classification.type }
        });
      }

      results.push({
        subject: email.subject,
        type: classification.type,
        matchedToApplication: matchedApplication ? true : false
      });
    }

    res.status(200).json({
      message: 'Emails synced successfully',
      processed: results
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { syncEmails };