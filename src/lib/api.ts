import axios from 'axios';
import type { IntermediateIdea, TaskDistribution, TeamInfo } from '../types/index.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

export interface GenerateIdeaRequest {
  input_text: string;
  uploaded_file_summary?: string;
  model?: string;
}

export interface GenerateIdeaResponse {
  success: boolean;
  idea: IntermediateIdea;
  timestamp: string;
}

export async function generateIdea(
  req: GenerateIdeaRequest
): Promise<IntermediateIdea> {
  const response = await apiClient.post<GenerateIdeaResponse>(
    '/api/generate-idea',
    req
  );
  return response.data.idea;
}

export interface SplitTasksRequest {
  idea: IntermediateIdea;
  team_info: TeamInfo;
  model?: string;
}

export interface SplitTasksResponse {
  success: boolean;
  distribution: TaskDistribution;
  timestamp: string;
}

export async function splitTasks(req: SplitTasksRequest): Promise<TaskDistribution> {
  const response = await apiClient.post<SplitTasksResponse>('/api/split-tasks', req);
  return response.data.distribution;
}

export async function uploadFile(
  file: File
): Promise<{ url: string; summary?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{
    success: boolean;
    url: string;
    summary?: string;
  }>('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return {
    url: response.data.url,
    summary: response.data.summary,
  };
}

export interface ModelsResponse {
  success: boolean;
  models: string[];
  timestamp: string;
}

export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await apiClient.get<ModelsResponse>('/api/models');
    return response.data.models;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}
