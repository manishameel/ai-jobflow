const prisma = require('../config/db');
const { generateAuthUrl, getTokensFromCode } = require('../services/gmailAuthService');

async function connectGmail(req, res) {
  try {
    const authUrl = generateAuthUrl();
    res.status(200).json({ authUrl: authUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function gmailCallback(req, res) {
  try {
    const code = req.query.code;

    const tokens = await getTokensFromCode(code);

    const userId = parseInt(req.query.state);

    await prisma.user.update({
      where: { id: userId },
      data: {
        gmailRefreshToken: tokens.refresh_token,
        gmailConnected: true
      }
    });

    res.send('Gmail connected successfully! You can close this tab and go back to the app.');

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { connectGmail, gmailCallback };