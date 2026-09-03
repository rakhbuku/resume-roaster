# 🔥 AI Resume Roaster

An AI-powered web application built with Next.js, Google Gemini API, Prisma ORM, Neon PostgreSQL, NextAuth.js, and pdf-parse.

## 🌟 Features
* **PDF Upload & Parsing**: Server-side text extraction from `.pdf` documents via `pdf-parse`.
* **Resilient AI Generation**: `@google/genai` SDK with multi-model fallback (`gemini-3.6-flash`, `gemini-1.5-flash`, `gemini-2.0-flash`).
* **Authentication**: NextAuth.js integrated with GitHub OAuth and `@next-auth/prisma-adapter`.
* **Database Persistence**: Stores resume contents and roasts inside Neon PostgreSQL.

## 🛠️ Tech Stack
* **Framework**: Next.js (Pages Router)
* **AI Engine**: `@google/genai`
* **Authentication**: NextAuth.js
* **PDF Parsing**: `pdf-parse`
* **Database & ORM**: Neon PostgreSQL & Prisma

## 🚀 Environment Variables
```env
DATABASE_URL="postgresql://user:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"