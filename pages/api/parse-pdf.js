export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pdfParse = require('pdf-parse');
    const { fileData } = req.body || {};

    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const parsed = await pdfParse(buffer);

    return res.status(200).json({ text: parsed.text });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse PDF' });
  }
}