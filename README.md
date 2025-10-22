# Hackerator

Hackerator is an innovative web application designed to assist hackathon participants in refining and evaluating their project ideas. Leveraging the power of Google Gemini AI, Hackerator acts as an expert hackathon judge, providing instant feedback, detailed evaluations, and strategic insights to help teams build winning projects.

## Features

- **AI-Powered Idea Evaluation:** Submit your hackathon idea (text and optional image) and receive a comprehensive evaluation from an AI judge powered by Google Gemini.
- **Structured Feedback:** AI responses are formatted into a strict JSON structure, providing a `short_summary` and a `detailed_description` covering core concepts, winning advantages, technical feasibility, market potential, and improvement suggestions.
- **Intuitive User Interface:** A clean and modern UI built with React and Tailwind CSS ensures a smooth user experience.
- **Model Selection:** Choose from different Gemini models (e.g., Gemini 2.5 Pro, Gemini 2.5 Flash) to tailor the AI's evaluation style.
- **Secure Authentication:** User authentication is handled via Supabase, ensuring a secure environment for your ideas.
- **Dynamic Page Flow:** A guided user journey from idea submission (`Home`) to AI evaluation (`Intermediate`) and a final readiness confirmation (`Final`).
- **Loading Animations:** Engaging Lottie animations provide visual feedback during AI generation and page transitions.
- **Profile Management:** Basic user profile management with a dedicated modal.

## Technologies Used

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Backend/Auth:** Supabase
- **Routing:** React Router DOM
- **Animations:** Lottie (via `lottie-react`)
- **State Management:** React Context API (for Auth and Theme)

## Installation & Setup

To get Hackerator up and running on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hemanthkumar2k04/Hackerator.git
   cd Hackerator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or yarn install
   ```

3. **Set up Environment Variables:**

   Create a `.env.local` file in the root of the project and add your Supabase and Gemini API keys:

   ```
   VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
   VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
   VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

   - You can get your Supabase URL and Anon Key from your Supabase project settings.
   - Obtain a Google Gemini API key from the Google AI Studio.

4. **Run the development server:**

   ```bash
   npm run dev
   # or yarn dev
   ```

   The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1. **Sign In/Up:** Register or log in using your Supabase credentials.
2. **Submit Idea:** On the Home page, enter your hackathon idea in the prompt input, optionally upload an image, and select a Gemini model.
3. **Get Evaluation:** Click "Generate" to receive an AI-powered evaluation of your idea on the Intermediate page.
4. **Start Hacking:** If satisfied with the evaluation, click "Start Hacking" to proceed to the Final page, indicating you're ready to build.

## Project Structure

```
Hackerator/
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── assets/             # Lottie animations, images
│   ├── components/         # Reusable UI components (e.g., Navbar, Modals, Buttons)
│   │   └── ui/             # Shadcn-like UI primitives
│   ├── contexts/           # React Contexts (Auth, Theme)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, API integrations (Gemini, Supabase)
│   ├── pages/              # Main application views (Home, Intermediate, Final, Landing, Saved)
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component and routing
│   ├── main.tsx            # Entry point for React app
│   └── ...
├── supabase/               # Supabase-related files (e.g., SQL migrations)
├── .env.local              # Environment variables
├── package.json            # Project dependencies and scripts
├── README.md               # This file
└── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
└── ...
```

## Future Enhancements

- Implement saving and retrieving evaluated ideas to Supabase.
- Add more sophisticated AI prompts for different stages of hackathon development (e.g., brainstorming, technical feedback).
- Allow users to edit and refine their ideas based on AI feedback.
- Integrate real-time collaboration features.
- Expand model selection and configuration options.
