import api from './axios';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/project.types';

export const createProject = async (dto: CreateProjectDto, workspaceId: string): Promise<Project> => {
  const response = await api.post<Project>(`/workspaces/${workspaceId}/projects`, dto);
  return response.data;
};

export const getProjects = async (workspaceId: string): Promise<Project[]> => {
  const response = await api.get<Project[]>(`/workspaces/${workspaceId}/projects`);
  return response.data;
};

export const getProjectById = async (projectId: string, workspaceId: string): Promise<Project> => {
  const response = await api.get<Project>(`/workspaces/${workspaceId}/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (dto: UpdateProjectDto, workspaceId: string, projectId: string): Promise<Project> => {
  const response = await api.patch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`, dto);
  return response.data;
};

export const deleteProject = async (workspaceId: string, projectId: string): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
};