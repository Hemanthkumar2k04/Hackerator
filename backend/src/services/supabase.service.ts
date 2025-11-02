import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config.ts';

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  bucket: string
): Promise<string> {
  const supabase = getSupabase();
  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, fileBuffer, {
    contentType: 'application/octet-stream',
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveIdea(
  userId: string,
  inputText: string,
  inputFileUrl: string | null,
  ideaTitle: string,
  ideaSummary: string,
  uniqueSellingPoint: string
): Promise<string> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('ideas')
    .insert({
      user_id: userId,
      input_text: inputText,
      input_file_url: inputFileUrl,
      idea_title: ideaTitle,
      idea_summary: ideaSummary,
      unique_selling_point: uniqueSellingPoint,
      status: 'draft',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to save idea: ${error.message}`);
  }

  return data.id;
}

export async function saveWorkspace(
  ideaId: string,
  title: string,
  teamInfo: Record<string, unknown>,
  aiDistribution: Record<string, unknown>
): Promise<string> {
  const supabase = getSupabase();

  // Create workspace
  const { data: workspaceData, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      idea_id: ideaId,
      title,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (workspaceError) {
    throw new Error(`Failed to create workspace: ${workspaceError.message}`);
  }

  const workspaceId = workspaceData.id;

  // Save team info
  const { error: teamError } = await supabase
    .from('team_info')
    .insert({
      workspace_id: workspaceId,
      members: teamInfo.members,
      ai_distribution: aiDistribution,
      created_at: new Date().toISOString(),
    });

  if (teamError) {
    throw new Error(`Failed to save team info: ${teamError.message}`);
  }

  // Save phases and tasks
  if (Array.isArray(aiDistribution.phases)) {
    for (const [phaseIndex, phase] of (aiDistribution.phases as unknown[]).entries()) {
      if (typeof phase === 'object' && phase !== null && 'phase_name' in phase && 'tasks' in phase) {
        const phaseObj = phase as Record<string, unknown>;
        const { error: phaseError } = await supabase
          .from('phases')
          .insert({
            workspace_id: workspaceId,
            title: phaseObj.phase_name,
            order_int: phaseIndex,
            is_completed: false,
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (phaseError) {
          throw new Error(`Failed to create phase: ${phaseError.message}`);
        }
      }
    }
  }

  return workspaceId;
}

export async function updatePhase(
  phaseId: string,
  notes?: string,
  todos?: unknown[],
  isCompleted?: boolean
): Promise<void> {
  const supabase = getSupabase();

  const updates: Record<string, unknown> = {};
  if (notes !== undefined) updates.notes = notes;
  if (todos !== undefined) updates.todos = todos;
  if (isCompleted !== undefined) updates.is_completed = isCompleted;

  const { error } = await supabase
    .from('phases')
    .update(updates)
    .eq('id', phaseId);

  if (error) {
    throw new Error(`Failed to update phase: ${error.message}`);
  }
}
