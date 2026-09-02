import { prisma } from '../../lib/db';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const history = await prisma.resume.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      return res.status(200).json(history);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: error.message || 'Failed to fetch history.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { resumeText } = req.body;

      if (!resumeText || !resumeText.trim()) {
        return res.status(400).json({ error: 'Resume content is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set on Vercel.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are a humorous, brutally honest tech recruiter roasting a candidate's resume. Critique their specific skills and experience with sharp humor.\n\nResume:\n${resumeText}`,
      });

      const roastContent = response.text;

      const savedEntry = await prisma.resume.create({
        data: {
          content: resumeText,
          roast: roastContent,
        },
      });

      return res.status(200).json({ roast: roastContent, id: savedEntry.id });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ error: 'ID is required' });

      await prisma.resume.delete({ where: { id: String(id) } });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Failed to delete item.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}