import api from './axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export const createTask = async (dto: CreateTaskDto): Promise<Task> => {
  const response = await api.post<{ data: Task }>('/tasks', dto);
  return response.data.data;
};

export const getTasksByBoard = async (boardId: string): Promise<Task[]> => {
  const response = await api.get<{ data: Task[] }>(`/tasks/boards/${boardId}`);
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<{ data: Task }>(`/tasks/${id}`);
  return response.data.data;
};

export const updateTask = async (id: string, dto: UpdateTaskDto): Promise<Task> => {
  const response = await api.patch<{ data: Task }>(`/tasks/${id}`, dto);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};