import api from './axios';
import type { Board, CreateBoardDto, UpdateBoardDto } from '../types/board.types';

export const createBoard = async (dto: CreateBoardDto, projectId: string): Promise<Board> => {
  const response = await api.post<Board>(`/projects/${projectId}/boards`, dto);
  return response.data;
};

export const getBoards = async (projectId: string): Promise<Board[]> => {
  const response = await api.get<Board[]>(`/projects/${projectId}/boards`);
  return response.data;
};

export const getBoardById = async (projectId: string, boardId: string): Promise<Board> => {
  const response = await api.get<Board>(`/projects/${projectId}/boards/${boardId}`);
  return response.data;
};

export const updateBoard = async (boardId: string, projectId: string, dto: UpdateBoardDto): Promise<Board> => {
  const response = await api.patch<Board>(`/projects/${projectId}/boards/${boardId}`, dto);
  return response.data;
};

export const deleteBoard = async (boardId: string, projectId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/boards/${boardId}`);
};