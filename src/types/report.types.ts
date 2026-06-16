export interface TaskSummary {
  boardId: string;
  boardName: string;
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  overdue: number;
}

export interface TimeSummary {
  userId: string;
  userName: string;
  totalMinutes: number;
  formattedTime: string;
}

export interface OverdueTask {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  boardId: string;
  assigneeId?: string;
}

export interface UserProductivity {
  userId: string;
  name: string;
  completed: number;
}