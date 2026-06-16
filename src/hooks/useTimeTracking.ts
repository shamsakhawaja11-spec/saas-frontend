import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeTrackingApi } from '../api/timeTracking.api';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from '../types/timeEntry.types';

// Get all time entries for a task
export const useTaskTimeEntries = (taskId: string) => {
  return useQuery({
    queryKey: ['time-entries', 'task', taskId],
    queryFn: () => timeTrackingApi.getByTask(taskId),
    enabled: !!taskId,
  });
};

// Get logged in user's entries
export const useMyTimeEntries = () => {
  return useQuery({
    queryKey: ['time-entries', 'my-entries'],
    queryFn: () => timeTrackingApi.getMyEntries(),
  });
};

// Get logged in user's total minutes
export const useMyTotal = () => {
  return useQuery({
    queryKey: ['time-entries', 'my-total'],
    queryFn: () => timeTrackingApi.getMyTotal(),
  });
};

// Create a time entry
export const useCreateTimeEntry = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTimeEntryDto) => timeTrackingApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-total'] });
    },
  });
};

// Update a time entry
export const useUpdateTimeEntry = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTimeEntryDto }) =>
      timeTrackingApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-total'] });
    },
  });
};

// Delete a time entry
export const useDeleteTimeEntry = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timeTrackingApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-entries', 'my-total'] });
    },
  });
};