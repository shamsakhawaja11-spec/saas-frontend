export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  COMMENT_ADDED = 'comment_added',
  TASK_STATUS_CHANGED = 'task_status_changed',
  TASK_DUE_SOON = 'task_due_soon',
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  metaData?: Record<string, any>;
  userId: string;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}