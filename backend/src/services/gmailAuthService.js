const { google } = require('googleapis');

function getOAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
  return oauth2Client;
}

function generateAuthUrl() {
  const oauth2Client = getOAuthClient();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'consent'
  });

  return authUrl;
}

async function getTokensFromCode(code) {
  const oauth2Client = getOAuthClient();
  const tokenResponse = await oauth2Client.getToken(code);
  return tokenResponse.tokens;
}

module.exports = { getOAuthClient, generateAuthUrl, getTokensFromCode };