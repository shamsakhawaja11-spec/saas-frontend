import api from './axios';
import type { Comment, CreateCommentDto, UpdateCommentDto } from '../types/comment.types';

export const commentsApi = {

  // POST /comments
  create: async (payload: CreateCommentDto): Promise<Comment> => {
    const { data } = await api.post('/comments', payload);
    return data;
  },

  // GET /comments/task/:taskId
  getByTask: async (taskId: string): Promise<Comment[]> => {
    const { data } = await api.get(`/comments/task/${taskId}`);
    return data;
  },

  // GET /comments/:id
  getById: async (id: string): Promise<Comment> => {
    const { data } = await api.get(`/comments/${id}`);
    return data;
  },

  // PATCH /comments/:id
  update: async (id: string, payload: UpdateCommentDto): Promise<Comment> => {
    const { data } = await api.patch(`/comments/${id}`, payload);
    return data;
  },

  // DELETE /comments/:id
  remove: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

};