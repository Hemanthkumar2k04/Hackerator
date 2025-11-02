# Getting Started with Hackerator 🚀

This guide will get you up and running in **10 minutes**.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** 9+ (comes with Node)
- **Ollama** ([download](https://ollama.ai)) for local LLM
- **Supabase** free account ([sign up](https://supabase.com))

## Step 1: Clone and Setup (2 min)

```powershell
# Clone repo
git clone <your-repo-url>
cd Hackerator

# Copy environment templates
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
```

## Step 2: Configure Supabase (3 min)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Go to **Settings** > **API** and copy:
   - **Project URL** → paste into `SUPABASE_URL` in `backend/.env`
   - **Anon Key** → paste into `SUPABASE_KEY` in `backend/.env`

### Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Copy the entire SQL below and run it:

```sql
-- Create tables for Hackerator

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  input_text TEXT,
  input_file_url VARCHAR,
  idea_title VARCHAR NOT NULL,
  idea_summary TEXT NOT NULL,
  unique_selling_point VARCHAR,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  title VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  title VARCHAR NOT NULL,
  notes TEXT,
  todos JSONB DEFAULT '[]',
  attachments JSONB DEFAULT '[]',
  order_int INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  members JSONB NOT NULL,
  ai_distribution JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT DO NOTHING;
```

## Step 3: Setup Ollama (2 min)

```powershell
# Download and install Ollama from https://ollama.ai
# Then in PowerShell:

ollama pull llama2

# In another terminal, start Ollama server:
ollama serve
# You'll see: "Listening on 127.0.0.1:11434"
```

**Keep Ollama running in the background!**

## Step 4: Install Dependencies (2 min)

```powershell
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

## Step 5: Start the Servers

### Terminal 1: Start Backend

```powershell
cd backend
npm run dev
```

You should see:

```
✓ Supabase initialized
✓ Server running on http://localhost:3001
```

### Terminal 2: Start Frontend

```powershell
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 6: Test It!

Open **http://localhost:5173** in your browser and:

1. ✅ You should see the Hackerator landing page
2. ✅ Try typing an idea: _"AI-powered hackathon guide"_
3. ✅ Click **✨ Generate Idea**
4. ✅ Watch the AI generate a refined idea
5. ✅ Click **Proceed to Team Setup**
6. ✅ Fill in team members (e.g., Alice, Bob, Charlie)
7. ✅ Toggle **"Let Hackerator AI split tasks"** ON
8. ✅ Click **Start Workspace**
9. ✅ Check backend logs for task distribution

## 🎉 You're Done!

Your Hackerator instance is running! Here's what works:

- ✅ **Idea Generation**: Type or upload an image/PDF → AI generates ideas
- ✅ **Team Setup**: Configure team and toggle AI task distribution
- ✅ **LLM Integration**: Ollama running locally (fast, private)
- ✅ **Supabase**: Database ready to store your ideas and workspaces

## 📝 Environment Files

### `.env` (Frontend)

```env
VITE_API_URL=http://localhost:3001
```

### `backend/.env` (Backend)

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Your Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Ollama (local LLM)
LLM_URL=http://localhost:11434
LLM_MODEL=llama2
LLM_TIMEOUT_MS=60000

# File upload
MAX_FILE_SIZE_MB=10
UPLOAD_TEMP_DIR=./tmp
```

## 🐛 Troubleshooting

### "Cannot connect to Ollama at http://localhost:11434"

**Solution**: Start Ollama in a new terminal:

```powershell
ollama serve
```

### "SUPABASE_URL environment variable is required"

**Solution**: Make sure `backend/.env` has your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### CORS error in browser console

**Solution**: Your frontend URL doesn't match `CORS_ORIGIN`. Ensure:

```env
# In backend/.env:
CORS_ORIGIN=http://localhost:5173
```

### "Cannot find module 'framer-motion'"

**Solution**: Reinstall dependencies:

```powershell
npm install
cd backend && npm install && cd ..
```

### Idea generation is slow

**Solution**: This is normal for local LLMs! Llama2 takes ~30-60s first run. Try a smaller model:

```powershell
ollama pull orca-mini  # Faster, smaller
ollama pull neural-chat  # Balanced
```

Then update `backend/.env`:

```env
LLM_MODEL=orca-mini
```

## 📚 Learn More

- [Full Setup Guide](./README.md)
- [API Documentation](./README.md#📝-api-endpoints)
- [Implementation Progress](./IMPLEMENTATION.md)

## 🚀 Next Steps

1. **Explore the code**: Check out `src/components/` and `backend/src/services/`
2. **Modify prompts**: Edit `backend/src/services/llm.service.ts` to customize AI behavior
3. **Add features**: Check `IMPLEMENTATION.md` for what's next
4. **Join community**: Star the repo and share feedback!

---

**Questions?** Open an issue on GitHub or check the [full README](./README.md).

Happy hacking! 🎉
