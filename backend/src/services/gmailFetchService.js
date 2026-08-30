const { google } = require('googleapis');
const { getOAuthClient } = require('./gmailAuthService');

async function fetchRecentEmails(refreshToken) {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
    q: 'newer_than:7d'
  });

  const messages = listResponse.data.messages || [];

  const emailDetails = [];

  for (let i = 0; i < messages.length; i++) {
    const msgId = messages[i].id;

    const msgResponse = await gmail.users.messages.get({
      userId: 'me',
      id: msgId
    });

    const headers = msgResponse.data.payload.headers;

    const subjectHeader = headers.find((h) => h.name === 'Subject');
    const fromHeader = headers.find((h) => h.name === 'From');

    const subject = subjectHeader ? subjectHeader.value : '';
    const sender = fromHeader ? fromHeader.value : '';
    const snippet = msgResponse.data.snippet || '';

    emailDetails.push({
      id: msgId,
      subject: subject,
      sender: sender,
      snippet: snippet
    });
  }

  return emailDetails;
}

module.exports = { fetchRecentEmails };