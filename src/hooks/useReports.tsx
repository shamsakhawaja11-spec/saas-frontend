import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/reports.api';

// Task summary for a board
export const useTaskSummary = (boardId: string) => {
  return useQuery({
    queryKey: ['reports', 'task-summary', boardId],
    queryFn: () => reportsApi.getTaskSummary(boardId),
    enabled: !!boardId,
  });
};

// Overdue tasks for a board
export const useOverdueTasks = (boardId: string) => {
  return useQuery({
    queryKey: ['reports', 'overdue', boardId],
    queryFn: () => reportsApi.getOverdueTasks(boardId),
    enabled: !!boardId,
  });
};

// User productivity for a board
export const useUserProductivity = (boardId: string) => {
  return useQuery({
    queryKey: ['reports', 'productivity', boardId],
    queryFn: () => reportsApi.getUserProductivity(boardId),
    enabled: !!boardId,
  });
};

// Time summary for a user
export const useTimeSummary = (userId: string) => {
  return useQuery({
    queryKey: ['reports', 'time-summary', userId],
    queryFn: () => reportsApi.getTimeSummary(userId),
    enabled: !!userId,
  });
};