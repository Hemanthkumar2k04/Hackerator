import express, { Router, Request, Response } from 'express';
import { pool } from '../db';
import { auth } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';
import { generateExecutionPlan } from '../services/llm.service';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router = Router();

// Middleware to extract user session
const extractUserSession = async (req: AuthenticatedRequest, res: Response, next: Function) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    
    if (session?.user?.id) {
      req.userId = session.user.id;
    }
    next();
  } catch (error) {
    next();
  }
};

router.use(extractUserSession);

interface WorkspaceData {
  project: {
    id: number;
    project_title: string;
    mode: string;
    estimated_timeline: string;
  };
  phases: Array<{
    id: number;
    title: string;
    description: string;
    order_index: number;
    completed: boolean;
  }>;
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, any>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    animated: boolean;
  }>;
}

// GET /api/workspace/:projectId
// Fetch complete workspace timeline for a project (user must own it)
router.get('/:projectId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Fetch project details and verify ownership
    const projectResult = await pool.query(
      'SELECT id, project_title, mode, estimated_timeline, user_id FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Verify user ownership
    if (req.userId && project.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this project' });
    }

    // Fetch phases
    const phasesResult = await pool.query(
      'SELECT id, title, description, order_index, completed FROM phases WHERE project_id = $1 ORDER BY order_index ASC',
      [projectId]
    );

    // Fetch all tasks for the project
    const tasksResult = await pool.query(
      `SELECT t.id, t.phase_id, t.title, t.description, t.assigned_to, t.completed 
       FROM tasks t
       JOIN phases p ON t.phase_id = p.id
       WHERE p.project_id = $1
       ORDER BY t.order_index ASC`,
      [projectId]
    );
    const tasks = tasksResult.rows;

    // Fetch workspace nodes
    const nodesResult = await pool.query(
      'SELECT node_key as id, type, data, position FROM workspace_nodes WHERE project_id = $1',
      [projectId]
    );

    // Fetch workspace edges
    const edgesResult = await pool.query(
      'SELECT id, source, target, type, metadata FROM workspace_edges WHERE project_id = $1',
      [projectId]
    );

    // Transform edges to include animated property
    const edges = edgesResult.rows.map((edge: any) => ({
      id: `edge-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      animated: edge.metadata?.animated || false,
    }));

    const workspaceData: WorkspaceData = {
      project,
      phases: phasesResult.rows,
      nodes: nodesResult.rows.map((node: any) => {
        const nodeData = node.data;
        // Attach tasks if this is a phase node
        if (nodeData.phaseId) {
          nodeData.tasks = tasks.filter((t: any) => t.phase_id === nodeData.phaseId);
        }
        return {
          id: node.id,
          type: node.type,
          data: nodeData,
          position: node.position,
        };
      }),
      edges,
    };

    res.json(workspaceData);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// POST /api/workspace/:projectId/task-complete
// Mark a task as complete (verify project ownership)
router.post('/:projectId/task-complete', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { taskId } = req.body;

    // Verify user owns the project
    if (req.userId) {
      const projectCheck = await pool.query(
        'SELECT user_id FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const result = await pool.query(
      'UPDATE tasks SET completed = true, updated_at = now() WHERE id = $1 AND phase_id IN (SELECT id FROM phases WHERE project_id = $2) RETURNING id, title, completed',
      [taskId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// POST /api/workspace/:projectId/generate
// Generate execution plan for a project
router.post('/:projectId/generate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    // Verify user owns the project
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    if (project.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if plan already exists
    const phasesCheck = await pool.query('SELECT id FROM phases WHERE project_id = $1', [projectId]);
    if (phasesCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    // Generate plan using LLM
    const plan = await generateExecutionPlan(
      {
        title: project.project_title,
        summary: project.short_summary,
        problem: project.problem_statement,
        features: project.key_features,
        tech_stack: project.tech_stack,
        architecture: project.architecture_overview
      },
      project.mode,
      project.team_size,
      project.original_idea || ''
    );

    // Save phases and tasks
    const phases = plan.nodes;
    const createdPhases = [];
    const createdNodes = [];
    const createdEdges = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      
      // Insert Phase
      const phaseResult = await pool.query(
        'INSERT INTO phases (project_id, title, description, order_index) VALUES ($1, $2, $3, $4) RETURNING id',
        [projectId, phase.title, phase.summary, i]
      );
      const phaseId = phaseResult.rows[0].id;
      createdPhases.push({ ...phase, id: phaseId });

      // Insert Tasks
      for (let j = 0; j < phase.tasks.length; j++) {
        const task = phase.tasks[j];
        await pool.query(
          'INSERT INTO tasks (phase_id, title, description, order_index, assigned_to) VALUES ($1, $2, $3, $4, $5)',
          [phaseId, task.title, task.description, j, task.assigned_to]
        );
      }

      // Create React Flow Node
      const node = {
        id: `phase-${phaseId}`,
        type: 'phase',
        position: { x: 250, y: i * 200 + 50 }, // Simple vertical layout
        data: { 
          label: phase.title,
          description: phase.summary,
          estimated_time: phase.estimated_time,
          phaseId: phaseId
        }
      };
      createdNodes.push(node);

      // Create Edge (if not first node)
      if (i > 0) {
        const prevPhaseId = createdPhases[i-1].id;
        const edge = {
          id: `edge-${prevPhaseId}-${phaseId}`,
          source: `phase-${prevPhaseId}`,
          target: `phase-${phaseId}`,
          type: 'default',
          animated: true
        };
        createdEdges.push(edge);
      }
    }

    // Save Nodes and Edges to DB
    for (const node of createdNodes) {
      await pool.query(
        'INSERT INTO workspace_nodes (project_id, node_key, type, data, position) VALUES ($1, $2, $3, $4, $5)',
        [projectId, node.id, node.type, JSON.stringify(node.data), JSON.stringify(node.position)]
      );
    }

    for (const edge of createdEdges) {
      await pool.query(
        'INSERT INTO workspace_edges (project_id, source, target, type, metadata) VALUES ($1, $2, $3, $4, $5)',
        [projectId, edge.source, edge.target, edge.type, JSON.stringify({ animated: edge.animated })]
      );
    }

    res.json({ success: true, message: 'Plan generated successfully' });

  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

// POST /api/workspace/:projectId/phase-complete
// Mark a phase as complete (verify project ownership)
router.post('/:projectId/phase-complete', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { phaseId } = req.body;

    // Verify user owns the project
    if (req.userId) {
      const projectCheck = await pool.query(
        'SELECT user_id FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const result = await pool.query(
      'UPDATE phases SET completed = true, updated_at = now() WHERE id = $1 AND project_id = $2 RETURNING id, title, completed',
      [phaseId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Phase not found' });
    }

    res.json({ success: true, phase: result.rows[0] });
  } catch (error) {
    console.error('Error updating phase:', error);
    res.status(500).json({ error: 'Failed to update phase' });
  }
});

// GET /api/workspace/:projectId/tasks/:phaseId
// Fetch tasks for a specific phase (verify project ownership)
router.get('/:projectId/tasks/:phaseId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, phaseId } = req.params;

    // Verify user owns the project
    if (req.userId) {
      const projectCheck = await pool.query(
        'SELECT user_id FROM projects WHERE id = $1',
        [projectId]
      );

      if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const result = await pool.query(
      `SELECT t.id, t.title, t.description, t.order_index, t.completed
       FROM tasks t
       JOIN phases p ON t.phase_id = p.id
       WHERE p.id = $1 AND p.project_id = $2
       ORDER BY t.order_index ASC`,
      [phaseId, projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching phase tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

export default router;
