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
DEMO_KEY=demo_value
DATABASE_URL="postgresql://neondb_owner:npg_Hx8hXwWEdF9N@ep-shiny-night-b36uk1en.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ANTHROPIC_API_KEY="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"
GEMINI_API_KEY="AQ.Ab8RN6Ll5VUaJRZrWrVVz56fG-fDajV-W8ju0I8msLVwtSirAw"
GITHUB_ID="Ov23liWeqGD0uuCzCSEC"
GITHUB_SECRET="ca3b8b6a45d314e29cda871242819eb2a8b89620"
NEXTAUTH_SECRET="a79c3f81e2b4092d83764e5910f132a8"
NEXTAUTH_URL="http://localhost:3000"