import { GoogleGenAI } from '@google/genai';

/**
 * Generates a resume roast using the AI API.
 * @param {string} resumeText - Plain text extracted from the user's resume.
 * @returns {Promise<string>} The generated critique.
 */
export async function roastResume(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error('Resume text cannot be empty.');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('API key configuration is missing.');
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
      console.warn(`Model ${modelName} failed, trying fallback...`, err.message);
      lastError = err;
    }
  }

  throw new Error(lastError ? lastError.message : 'AI service is temporarily unavailable.');
}

export default roastResume;