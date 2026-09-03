// Complete polyfills for PDF processing in Vercel Serverless runtimes
if (typeof globalThis.DOMMatrix === 'undefined') {
  const matrixProxyHandler = {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (prop === 'toFloat32Array') return () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      if (prop === 'toFloat64Array') return () => new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      if (prop === 'transformPoint') return (p = {}) => ({ x: p.x || 0, y: p.y || 0, z: p.z || 0, w: p.w || 1 });
      // Return a dummy chainable function for any invoked matrix method
      return function () { return target; };
    }
  };

  class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
      this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
      this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
      this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;
      this.is2D = true;
      this.isIdentity = true;
      return new Proxy(this, matrixProxyHandler);
    }
    static fromMatrix() { return new DOMMatrix(); }
    static fromFloat32Array() { return new DOMMatrix(); }
    static fromFloat64Array() { return new DOMMatrix(); }
  }

  globalThis.DOMMatrix = DOMMatrix;
}

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    constructor(width, height) {
      this.width = width || 1;
      this.height = height || 1;
      this.data = new Uint8ClampedArray((width || 1) * (height || 1) * 4);
    }
  };
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {
    addPath() {}
  };
}

try {
  require('pdf-parse/worker');
} catch (e) {
  // Ignored if using pdf-parse v1
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
    const pdfParseModule = require('pdf-parse');
    const { fileData } = req.body || {};

    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    let parsedText = '';

    if (typeof pdfParseModule === 'function') {
      const parsed = await pdfParseModule(buffer);
      parsedText = parsed.text;
    } else if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      const result = await parser.getText();
      parsedText = result.text;
      if (parser.destroy) await parser.destroy();
    } else {
      throw new Error('Unsupported pdf-parse export format');
    }

    return res.status(200).json({ text: parsedText });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse PDF' });
  }
}