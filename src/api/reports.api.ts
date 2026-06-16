import api from './axios';
import type {TaskSummary,TimeSummary, OverdueTask, UserProductivity } from '../types/report.types';

export const reportsApi = {

  // GET /reports/board/:boardId/tasks
  getTaskSummary: async (boardId: string): Promise<TaskSummary> => {
    const { data } = await api.get(`/reports/board/${boardId}/tasks`);
    return data;
  },

  // GET /reports/board/:boardId/overdue
  getOverdueTasks: async (boardId: string): Promise<OverdueTask[]> => {
    const { data } = await api.get(`/reports/board/${boardId}/overdue`);
    return data;
  },

  // GET /reports/board/:boardId/productivity
  getUserProductivity: async (boardId: string): Promise<UserProductivity[]> => {
    const { data } = await api.get(`/reports/board/${boardId}/productivity`);
    return data;
  },

  // GET /reports/user/:userId/time
  getTimeSummary: async (userId: string): Promise<TimeSummary> => {
    const { data } = await api.get(`/reports/user/${userId}/time`);
    return data;
  },

};