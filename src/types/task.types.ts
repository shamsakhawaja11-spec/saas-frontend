export type TaskStatus='todo'|'in_progress'|'in_review'|'done';
export type TaskPriority='low'|'medium'|'high'|'urgent';

export interface Task{
    id:string;
    title:string;
    description?:string;
    status:TaskStatus;
    priority:TaskPriority;
    position?:string;
    dueDate?:string;
    estimatedHours?:string;
    boardId:string;
    assigneeId:string;
    creatorId:string;
    createdAt:string;
    updatedAt:string;
}
export interface CreateTaskDto{
    title:string;
    description?:string;
    status?:TaskStatus;
    priority?:TaskPriority;
    position?:string;
    duedate?:string;
    estimatedHours?:string;
    boardId:string;
    assigneeId?:string;
}
export interface UpdateTaskDto{
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    position?: number;
    estimatedHours?: number;
    assigneeId?: string;
}