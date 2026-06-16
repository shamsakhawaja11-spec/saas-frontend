// ADD
export const NotificationType = {
  TASK_ASSIGNED: 'task_assigned',
  COMMENT_ADDED: 'comment_added',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TASK_DUE_SOON: 'task_due_soon',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  metaData?: Record<string, unknown>;
  userId: string;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}