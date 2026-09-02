import { GoogleGenAI } from '@google/genai';

/**
 * Generates a resume roast using Google Gemini.
 * @param {string} resumeText - Text extracted from the resume.
 * @returns {Promise<string>} The generated roast string.
 */
export async function roastResume(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error('Resume text is required.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('API key is not configured in environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are a humorous, brutally honest tech recruiter roasting a candidate's resume. Critique their specific skills and experience with sharp humor.\n\nResume:\n${resumeText}`;

  const candidateModels = ['gemini-3.6-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed, retrying...`, err.message);
      lastError = err;
    }
  }

  throw new Error(lastError ? lastError.message : 'Failed to reach AI provider.');
}

export default roastResume;