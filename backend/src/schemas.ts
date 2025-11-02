import { z } from 'zod';

// Intermediate idea schema (from LLM)
export const IntermediateIdeaSchema = z.object({
  idea_title: z.string().max(100),
  idea_summary: z.string().max(500),
  unique_selling_point: z.string().max(200),
});

export type IntermediateIdea = z.infer<typeof IntermediateIdeaSchema>;

// Task schema
export const TaskSchema = z.object({
  task_id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  estimate_minutes: z.number().positive().optional().default(30),
  assigned_to: z.string().nullable().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// Phase schema
export const PhaseSchema = z.object({
  phase_name: z.string(),
  tasks: z.array(TaskSchema),
});

export type Phase = z.infer<typeof PhaseSchema>;

// Task distribution schema (from LLM)
export const TaskDistributionSchema = z.object({
  phases: z.array(PhaseSchema),
});

export type TaskDistribution = z.infer<typeof TaskDistributionSchema>;

// Team member schema
export const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Team info schema
export const TeamInfoSchema = z.object({
  project_name: z.string(),
  team_size: z.number().positive(),
  members: z.array(TeamMemberSchema),
  ai_split_tasks: z.boolean(),
});

export type TeamInfo = z.infer<typeof TeamInfoSchema>;
