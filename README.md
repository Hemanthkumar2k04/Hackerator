📌 About the Project

Hackerator is a full-stack, AI-powered idea generator designed to help students, developers, and hackathon participants generate well-structured project ideas based on selected domains or user-provided input.

Instead of manually crafting detailed AI prompts, Hackerator simplifies the process: users select one or more domains (e.g., AI, FinTech, Web3) or enter their own idea, and the system generates relevant, one-line project suggestions. After selecting a topic, the app expands it into a full idea breakdown including the tech stack, description, roadmap, challenges, stretch goals, and estimated time.

    🎥 Demo Video Here



https://github.com/user-attachments/assets/cec92986-0b19-46c4-874a-ac60c71299b8




⚙️ Technology Stack

    Frontend: React, TypeScript, Tailwind CSS

    Backend: Express.js, Node.js

    Authentication: Clerk

    Database: Supabase (with Row Level Security & JWT integration)

    LLM Integration:

        🔹 Development: Gemma 3 via Ollama (local inference)

        🔹 Production-ready: Designed to support OpenAI's ChatGPT API, Claude, or any other cloud-based LLM via prompt switching and API abstraction

    Prompt Engineering: Server-side dynamic prompt generation based on user flow

🚧 Project Status

This project is actively under development. While the core functionality is in place, the following areas are still being refined:

    Idea retrieval per authenticated user

    Responsive UI/UX polish

    Finalizing production-grade API switch and environment configuration

🙌 Purpose and Vision

Hackerator was built to solve a simple but frustrating problem: “I know the domain, but I don’t know what to build.” This tool removes that creative barrier and delivers structured, actionable project ideas powered by AI.

Beyond solving that user pain point, the project is also a practical learning initiative — exploring everything from modern frontend frameworks to secure backend integration, local LLMs, and flexible architecture that supports switching AI providers without changing the core system.

Things you'd need incase you're cloning this:
-> Supabase URL
-> Supabase Anon key
-> Clerk publishable key

Put them in .env or .env.local file in the directory!
