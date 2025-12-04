import { Router } from 'express';
import { generateProjectPlan } from '../services/llm.service';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      console.log('Missing idea:', { idea });
      res.status(400).json({ error: 'Idea is required' });
      return;
    }

    console.log('Generating project plan for:', { idea });
    const projectPlan = await generateProjectPlan(idea);
    console.log('Project plan generated successfully');
    res.json(projectPlan);
  } catch (error) {
    console.error('Error generating project plan:', error);
    res.status(500).json({ error: 'Failed to generate project plan' });
  }
});

export default router;
