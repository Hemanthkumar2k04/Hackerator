import { Router } from 'express';
import { pool } from '../db';

const router = Router();

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
