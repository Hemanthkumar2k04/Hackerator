-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  mode TEXT NOT NULL,
  original_idea TEXT,
  selected_domains JSONB,
  team_size INTEGER,
  project_title TEXT,
  short_summary TEXT,
  problem_statement TEXT,
  key_features JSONB,
  target_users JSONB,
  tech_stack JSONB,
  architecture_overview TEXT,
  estimated_timeline TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  order_index INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  order_index INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create workspace_nodes table
CREATE TABLE IF NOT EXISTS workspace_nodes (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  node_key TEXT,
  type TEXT,
  position JSONB,
  data JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create workspace_edges table
CREATE TABLE IF NOT EXISTS workspace_edges (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  source TEXT,
  target TEXT,
  type TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
