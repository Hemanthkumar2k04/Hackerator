// API Response types
export interface IntermediateIdea {
  idea_title: string;
  idea_summary: string;
  unique_selling_point: string;
}

export interface Task {
  task_id: string;
  title: string;
  description: string;
  estimate_minutes: number;
  assigned_to: string | null;
}

export interface Phase {
  phase_name: string;
  tasks: Task[];
}

export interface TaskDistribution {
  phases: Phase[];
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface TeamInfo {
  project_name: string;
  team_size: number;
  members: TeamMember[];
  ai_split_tasks: boolean;
}

export interface WorkspaceData {
  id: string;
  idea_id: string;
  title: string;
  created_at: string;
}

export interface PhaseData {
  id: string;
  workspace_id: string;
  title: string;
  notes?: string;
  todos?: Array<{ id: string; text: string; completed: boolean }>;
  attachments?: Array<{ id: string; url: string; name: string }>;
  order_int: number;
  is_completed: boolean;
  created_at: string;
}

export interface IdeaData {
  id: string;
  user_id: string;
  input_text: string;
  input_file_url: string | null;
  idea_title: string;
  idea_summary: string;
  unique_selling_point: string;
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
}
