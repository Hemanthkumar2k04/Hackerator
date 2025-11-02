import { type Request, type Response } from 'express';
import { getAvailableModels } from '../services/llm.service.ts';

export async function getModelsHandler(req: Request, res: Response): Promise<void> {
  try {
    const models = await getAvailableModels();

    res.json({
      success: true,
      models,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
