import express, { type Express, type Request, type Response} from 'express';
import cors from 'cors';
import { config } from './config.ts';
import { initSupabase } from './services/supabase.service.ts';
import { generateIdeaHandler } from './routes/ideas.ts';
import { splitTasksHandler, uploadHandler } from './routes/tasks.ts';
import { getModelsHandler } from './routes/models.ts';


const app: Express = express();

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/models', getModelsHandler);
app.post('/api/generate-idea', generateIdeaHandler);
app.post('/api/split-tasks', splitTasksHandler);
app.post('/api/upload', uploadHandler);


// Error handler
app.use((err: unknown, req: Request, res: Response) => {
  console.error('Error:', err);

  if (err instanceof Error) {
    return res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// Initialize Supabase and start server
async function start() {
  try {
    initSupabase();
    console.log('✓ Supabase initialized');

    app.listen(config.PORT, () => {
      console.log(`✓ Server running on http://localhost:${config.PORT}`);
      console.log(`  NODE_ENV: ${config.NODE_ENV}`);
      console.log(`  LLM: ${config.LLM_URL} (model: ${config.LLM_MODEL})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
