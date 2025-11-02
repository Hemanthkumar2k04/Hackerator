import { type Request, type Response } from 'express';
import { generateIdea } from '../services/llm.service';

export async function generateIdeaHandler(req: Request, res: Response): Promise<void> {
  try {
    const { input_text, uploaded_file_summary, model } = req.body as {
      input_text?: string;
      uploaded_file_summary?: string;
      model?: string;
    };

    if (!input_text) {
      res.status(400).json({ error: 'input_text is required' });
      return;
    }

    const idea = await generateIdea(input_text, uploaded_file_summary, model);

    res.json({
      success: true,
      idea,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating idea:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
