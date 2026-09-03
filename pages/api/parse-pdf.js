// Polyfill browser APIs required by pdfjs-dist in Node.js serverless runtimes
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  };
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {
    addPath() {}
  };
}

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