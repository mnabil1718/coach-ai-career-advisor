# Coach.ai

<p align="center">
<h1 align="center">Coach.ai</h1>
</p>

<p align="center">
<strong>Your AI-powered career coach platform.</strong> From CV optimization to acing the interview, we help job seekers land their dream roles.
</p>

<p>Check out: <a href="https://coach-eight-ashy.vercel.app/">live demo</a></p>

<p align="center">
<a href="#-how-it-works"><strong>How it Works</strong></a> ·
<a href="#-features"><strong>Features</strong></a> ·
<a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
<a href="#-getting-started"><strong>Getting Started</strong></a>
</p>

---

## 🚀 How it Works

Landing a job is a journey. Coach.ai guides you through every step:

1. **Upload CV:** Get instant, actionable feedback on your resume.
2. **Mock Interview:** Practice with an AI that simulates real-world hiring managers.
3. **Analyze & Improve:** Identify skill gaps and follow personalized roadmaps.
4. **Apply:** Head to your dream job with total confidence.

---

## ✨ Features

- **Smart CV Parsing:** Automatically extract data and receive a detailed review of your resume's strengths and weaknesses.
- **AI Mock Interviews:** Realistic, conversational interview practice with instant feedback on your answers.
- **Skill Gap Analysis:** Compare your current profile against industry standards to see what's missing.
- **Career Resources:** Download personalized reports, pre-interview checklists, and curated learning roadmaps.
- **Progress Tracking:** Comprehensive session history so you can pick up exactly where you left off.

---

## 🛠 Tech Stack

Coach.ai is built with a modern, high-performance stack:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Intelligence:** [Gemini API](https://ai.google.dev/) (Google AI)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

---

## 🏃 Getting Started

### Prerequisites

- A [Supabase](https://database.new) project
- A [Google AI Studio](https://aistudio.google.com/) API Key for Gemini

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/coach-ai.git
cd coach-ai

```

2. **Install dependencies:**

```bash
npm install

```

3. **Setup Environment Variables:**
   Rename `.env.example` to `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

```

4. **Run the development server:**

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to see the app in action!

---

## 📈 Deployment

The easiest way to deploy Coach.ai is via [Vercel](https://vercel.com/new). Make sure to add your Supabase and Gemini environment variables in the Vercel dashboard.

---

> [!TIP]
> **Coach.ai** is currently in active development. If you encounter any bugs or have feature requests, please open an issue!

---
