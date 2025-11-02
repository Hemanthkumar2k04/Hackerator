import { type Request, type Response } from 'express';
import { splitTasks } from '../services/llm.service';
import { TeamInfoSchema, type IntermediateIdea } from '../schemas';

export async function splitTasksHandler(req: Request, res: Response): Promise<void> {
  try {
    const { idea, team_info, model } = req.body as {
      idea?: unknown;
      team_info?: unknown;
      model?: string;
    };

    console.log('[splitTasksHandler] Received model:', model);
    console.log('[splitTasksHandler] Request body:', JSON.stringify(req.body, null, 2));

    if (!idea || !team_info) {
      res.status(400).json({
        error: 'Both idea and team_info are required',
      });
      return;
    }

    const teamInfo = TeamInfoSchema.parse(team_info);
    const distribution = await splitTasks(idea as IntermediateIdea, teamInfo, model);

    res.json({
      success: true,
      distribution,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error splitting tasks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}

export async function uploadHandler(req: Request, res: Response): Promise<void> {
  try {
    res.status(501).json({
      error: 'File upload not yet implemented',
      message: 'Configure multer middleware and Supabase Storage',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
