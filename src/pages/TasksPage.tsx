import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckSquare, Loader2 } from 'lucide-react';
import { getMyTasks } from '../api/tasks.api';
import type { TaskStatus, TaskPriority } from '../types/task.types';

const PRIORITY_STYLES = {
  urgent: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-slate-500/20 text-slate-400',
};

const STATUS_STYLES = {
  todo: 'bg-slate-500/20 text-slate-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  in_review: 'bg-yellow-500/20 text-yellow-400',
  done: 'bg-green-500/20 text-green-400',
};

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

const TasksPage = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: getMyTasks,
  });

  const filtered = tasks.filter((task) => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white">

      {/* Header */}
      <div className="border-b border-slate-700 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare size={20} className="text-primary-500" />
          <div>
            <h1 className="text-lg font-bold text-white">My Tasks</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 border-b border-slate-700 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          className="bg-dark-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          className="bg-dark-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <span className="text-xs text-slate-500 ml-auto">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      <div className="px-8 py-6">

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        )}

        {isError && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-5">
            <p className="text-red-400 text-sm font-semibold">Failed to load tasks</p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-14 text-center">
            <CheckSquare size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No tasks found</p>
            <p className="text-slate-600 text-xs mt-1">
              Try changing your filters or create tasks from a board
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((task) => (
              <div
                key={task.id}
                className="bg-dark-800 border border-slate-700 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-slate-600 transition"
              >
                {/* Priority dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  task.priority === 'urgent' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-orange-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-slate-500'
                }`} />

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{task.description}</p>
                  )}
                </div>

                {/* Status badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_STYLES[task.status]}`}>
                  {STATUS_LABELS[task.status]}
                </span>

                {/* Priority badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority}
                </span>

                {/* Due date */}
                {task.dueDate && (
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;