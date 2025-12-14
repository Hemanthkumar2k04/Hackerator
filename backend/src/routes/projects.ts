import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { auth } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';

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

// Ensure table exists (simple approach for now)
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    short_summary TEXT,
    problem_statement TEXT,
    key_features JSONB,
    target_users JSONB,
    tech_stack JSONB,
    architecture_overview TEXT,
    estimated_timeline TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(createTableQuery).catch(err => console.error('Error creating projects table:', err));

// POST /api/projects/save - Save a project with user context (authenticated)
router.post('/save', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: User session required' });
    }

    const {
      project_title,
      short_summary,
      problem_statement,
      key_features,
      target_users,
      team_size,
      tech_stack,
      architecture_overview,
      estimated_timeline,
      notes,
      mode,
    } = req.body;

    const query = `
      INSERT INTO projects (
        user_id, mode, original_idea, team_size,
        project_title, short_summary, problem_statement, key_features, target_users, 
        tech_stack, architecture_overview, estimated_timeline, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id as project_id, user_id, project_title, mode, team_size;
    `;

    const values = [
      req.userId,
      mode || 'project',
      '', // original_idea can be added later
      team_size || 1,
      project_title,
      short_summary,
      problem_statement,
      JSON.stringify(key_features),
      JSON.stringify(target_users),
      JSON.stringify(tech_stack),
      architecture_overview,
      estimated_timeline,
      notes
    ];

    const result = await pool.query(query, values);
    const project = result.rows[0];

    res.status(201).json({
      success: true,
      project_id: project.project_id,
      message: `Project "${project.project_title}" created for user ${project.user_id}`
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// GET /api/projects - Get all projects (for current user if authenticated)
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT id, user_id, project_title, mode, team_size, short_summary, 
             created_at, updated_at
      FROM projects
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [req.userId]);
    res.json({
      success: true,
      projects: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:projectId - Get a specific project (verify ownership)
router.get('/:projectId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId } = req.params;
    
    // First check if project exists at all
    const projectCheckQuery = 'SELECT user_id FROM projects WHERE id = $1';
    const projectCheck = await pool.query(projectCheckQuery, [projectId]);
    
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Then verify ownership
    if (projectCheck.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this project' });
    }

    const query = `
      SELECT * FROM projects
      WHERE id = $1 AND user_id = $2;
    `;

    const result = await pool.query(query, [projectId, req.userId]);
    
    res.json({
      success: true,
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Legacy endpoint (for backward compatibility)
router.post('/', async (req, res) => {
  try {
    const {
      project_title,
      short_summary,
      problem_statement,
      key_features,
      target_users,
      tech_stack,
      architecture_overview,
      estimated_timeline,
      notes
    } = req.body;

    const query = `
      INSERT INTO projects (
        title, short_summary, problem_statement, key_features, target_users, 
        tech_stack, architecture_overview, estimated_timeline, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      project_title,
      short_summary,
      problem_statement,
      JSON.stringify(key_features),
      JSON.stringify(target_users),
      JSON.stringify(tech_stack),
      architecture_overview,
      estimated_timeline,
      notes
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

export default router;
