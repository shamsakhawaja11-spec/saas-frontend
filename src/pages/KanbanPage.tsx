import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Loader2, X } from 'lucide-react';
import type{DropResult } from '@hello-pangea/dnd';
import { getTasksByBoard, createTask, updateTask } from '../api/tasks.api';
import type { Task, TaskStatus } from '../types/task.types';

// ── Column config ──────────────────────────────────────
const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'in_review', label: 'In Review', color: 'bg-yellow-500' },
  { id: 'done', label: 'Done', color: 'bg-green-500' },
];

// ── Task Card ──────────────────────────────────────────
const TaskCard = ({
  task,
  index,
}: {
  task: Task;
  index: number;
}) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-dark-900 border rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${
          snapshot.isDragging
            ? 'border-primary-500 shadow-lg shadow-primary-500/20'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <p className="text-sm text-white font-medium">{task.title}</p>
        {task.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
            task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-slate-500/20 text-slate-400'
          }`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-slate-500">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    )}
  </Draggable>
);

// ── Kanban Page ────────────────────────────────────────
const KanbanPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');
  const [error, setError] = useState('');

  // ── Fetch tasks ──
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => getTasksByBoard(boardId!),
    enabled: !!boardId,
  });

  // ── Update task status (drag and drop) ──
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });

  // ── Create task ──
  const createMutation = useMutation({
    mutationFn: () =>
      createTask({
        title: newTaskTitle,
        status: newTaskStatus,
        boardId: boardId!,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId], refetchType: 'all' });
      setShowModal(false);
      setNewTaskTitle('');
      setNewTaskStatus('todo');
      setError('');
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      setError(err?.response?.data?.message || 'Failed to create task');
    },
  });

  // ── Drag end handler ──
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    const oldStatus = result.source.droppableId as TaskStatus;

    if (newStatus === oldStatus) return;

    // Optimistic update — update cache immediately before API call
    queryClient.setQueryData(['tasks', boardId], (old: Task[] = []) =>
      old.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    updateMutation.mutate({ id: taskId, status: newStatus });
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="min-h-screen bg-dark-900 text-white">

      {/* Header */}
      <div className="border-b border-slate-700 px-8 py-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Kanban Board</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Board */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COLUMNS.map((col) => (
                <div key={col.id} className="bg-dark-800 border border-slate-700 rounded-xl p-4">

                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    <h2 className="text-sm font-semibold text-slate-300">{col.label}</h2>
                    <span className="ml-auto text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      {getTasksByStatus(col.id).length}
                    </span>
                  </div>

                  {/* Droppable Column */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-24 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-primary-500/10' : ''
                        }`}
                      >
                        {getTasksByStatus(col.id).map((task, index) => (
                          <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">New Task</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">Title *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Fix login bug"
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            <div className="mb-5">
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">Status</label>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 transition"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setError(''); setNewTaskTitle(''); }}
                className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTaskTitle.trim()) { setError('Title is required'); return; }
                  createMutation.mutate();
                }}
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
              >
                {createMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;