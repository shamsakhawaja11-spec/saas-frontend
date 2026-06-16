export interface TimeEntry {
  id: string;
  minutes: number;
  description?: string;
  taskId: string;
  userId: string;
  logDate: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateTimeEntryDto {
  minutes: number;
  description?: string;
  taskId: string;
  logDate: string;
}

export interface UpdateTimeEntryDto {
  minutes?: number;
  description?: string;
  logDate?: string;
}

export interface TotalMinutes {
  total: number;
}