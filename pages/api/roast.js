import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  // POST: Create roast
  if (req.method === 'POST') {
    try {
      const { resumeText } = req.body;

      if (!resumeText) {
        return res.status(400).json({ error: 'Resume content is required' });
      }

      const roastContent = `🔥 **BRUTAL ROAST VERDICT** 🔥

1. **Skills Section**: Listing 'VS Code' under technical skills? What's next, listing 'Computer Mouse' and 'Power Button'?
2. **Experience**: "Worked on various tasks" and "Helped design components" sound like you were sitting in the room while other people actually built the app. Quantify your impact!
3. **Projects**: Your weather app using OpenWeather API is the 'Hello World' of software engineering. Everyone and their cat has built one.
4. **Summary**: "Hardworking and passionate developer" — this is boilerplate fluff. Show, don't tell!

💡 **Action Plan**:
- Add real metrics (e.g., "Improved page load speeds by 25%").
- Remove basic software tools from your skills list.
- Highlight complex architectural decisions in your E-Commerce project.`;

      const savedEntry = await prisma.resume.create({
        data: {
          content: resumeText,
          roast: roastContent,
        },
      });

      return res.status(200).json({ roast: roastContent, id: savedEntry.id });
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: error.message || 'Failed to generate roast.' });
    }
  }

  // DELETE: Remove entry (handles CUID/UUID string IDs)
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || req.body?.id;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      await prisma.resume.delete({
        where: { id: String(id) }, // Keeps ID as a string for cuid/uuid schema
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE error in Prisma:', error);
      return res.status(500).json({ error: 'Failed to delete item from database.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}