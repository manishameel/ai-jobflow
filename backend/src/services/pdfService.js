const axios = require('axios');
const { PDFParse } = require('pdf-parse');

async function extractTextFromPdfUrl(pdfUrl) {
  const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
  const pdfBuffer = Buffer.from(response.data);

  const parser = new PDFParse({ data: pdfBuffer });
  const result = await parser.getText();
  await parser.destroy();

  return result.text;
}

module.exports = { extractTextFromPdfUrl };