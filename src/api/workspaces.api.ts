import api from './axios';
import type { Workspace, CreateWorkspaceDto, UpdateWorkspaceDto } from '../types/workspace.types';

export const createWorkspace = async (dto: CreateWorkspaceDto): Promise<Workspace> => {
  const response = await api.post<{ data: Workspace }>('/workspaces', dto);
  return response.data.data;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<{ data: Workspace[] }>('/workspaces');
  return response.data.data;
};

export const getWorkspaceById = async (id: string): Promise<Workspace> => {
  const response = await api.get<{ data: Workspace }>(`/workspaces/${id}`);
  return response.data.data;
};

export const updateWorkspace = async (id: string, dto: UpdateWorkspaceDto): Promise<Workspace> => {
  const response = await api.put<{ data: Workspace }>(`/workspaces/${id}`, dto);
  return response.data.data;
};

export const deleteWorkspace = async (id: string): Promise<void> => {
  await api.delete(`/workspaces/${id}`);
};