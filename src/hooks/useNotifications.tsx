import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';

// Get all notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll(),
  });
};

// Get unread notifications only
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnread(),
  });
};

// Get unread count — used in navbar badge
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // refetch every 30 seconds automatically
  });
};

// Mark all as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mark one as read
export const useMarkOneAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markOneAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};