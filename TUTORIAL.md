```markdown
# 📖 Resume Roaster Architecture & Tutorial

## 🏗️ Architecture Overview
* **Frontend**: Next.js Pages Router interface for raw text input and PDF uploading.
* **PDF Extraction (`/api/parse-pdf`)**: Converts Base64 PDF buffers into plain text using `pdf-parse`.
* **AI Engine (`lib/claude.js`)**: Invokes `@google/genai` with multi-model fallback across `gemini-3.6-flash`, `gemini-1.5-flash`, and `gemini-2.0-flash`.
* **Auth (`/api/auth/[...nextauth]`)**: Manages GitHub OAuth sessions via NextAuth.js and Prisma Adapter.
* **Database (`/api/roast`)**: Persists resume submissions and generated critiques in Neon PostgreSQL.

## 📡 API Endpoints
* `POST /api/parse-pdf`: Accepts `{ "base64Pdf": "string" }`, returns `{ "text": "extracted text" }`.
* `POST /api/roast`: Accepts `{ "resumeText": "string" }`, returns `{ "roast": "AI output", "id": "cuid" }`.
* `GET /api/roast`: Fetches the 10 most recent roasts from Neon PostgreSQL.
* `DELETE /api/roast`: Deletes a saved roast entry by ID (`?id=cuid`).