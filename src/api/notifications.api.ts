import api from './axios';
import type{ Notification, UnreadCount } from '../types/notification.types';

export const notificationsApi = {

  // GET /notifications
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data;
  },

  // GET /notifications/unread
  getUnread: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications/unread');
    return data;
  },

  // GET /notifications/count
  getUnreadCount: async (): Promise<UnreadCount> => {
    const { data } = await api.get('/notifications/count');
    return data;
  },

  // PATCH /notifications/read-all
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  // PATCH /notifications/:id/read
  markOneAsRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

};