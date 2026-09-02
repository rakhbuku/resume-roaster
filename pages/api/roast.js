import { prisma } from '../../lib/prisma';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // GET: Fetch history
  if (req.method === 'GET') {
    try {
      const history = await prisma.resume.findMany({
        orderBy: { id: 'desc' },
        take: 10,
      });
      return res.status(200).json(history);
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch history.' });
    }
  }

  // POST: Create roast with Google Gemini
  if (req.method === 'POST') {
    try {
      const { resumeText } = req.body;

      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({ error: 'Resume content is required.' });
      }

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a humorous, brutally honest tech recruiter roasting a candidate's resume. Critique their experience, formatting, or missing metrics constructively but with sharp humor.\n\nHere is the resume content:\n${resumeText}`,
      });

      const roastContent = response.text;

      // Save to Neon via Prisma
      const savedEntry = await prisma.resume.create({
        data: {
          content: resumeText,
          roast: roastContent,
        },
      });

      return res.status(200).json({ roast: roastContent, id: savedEntry.id });
    } catch (error) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({ error: error.message || 'Failed to generate live roast.' });
    }
  }

  // DELETE: Remove entry
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || req.body?.id;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await prisma.resume.delete({
        where: { id: String(id) },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE error in Prisma:', error);
      return res.status(500).json({ error: 'Failed to delete item from database.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}