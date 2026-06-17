import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { useTaskTimeEntries, useCreateTimeEntry, useUpdateTimeEntry, useDeleteTimeEntry } from '../../hooks/useTimeTracking';
import type{ TimeEntry } from '../../types/timeEntry.types';

const timeEntrySchema = z.object({
  minutes: z.number().min(1, 'Must be at least 1 minute').max(1440, 'Max 24 hours'),
  description: z.string().optional(),
  logDate: z.string().min(1, 'Date is required'),
});

type TimeEntryForm = z.infer<typeof timeEntrySchema>;

interface TimeTrackingSectionProps {
  taskId: string;
  currentUserId: string;
}

export const TimeTrackingSection = ({ taskId, currentUserId }: TimeTrackingSectionProps) => {
  const { data: entries, isLoading } = useTaskTimeEntries(taskId);
  const createEntry = useCreateTimeEntry(taskId);
  const updateEntry = useUpdateTimeEntry(taskId);
  const deleteEntry = useDeleteTimeEntry(taskId);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogDate, setEditLogDate] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TimeEntryForm>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      logDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (values: TimeEntryForm) => {
    createEntry.mutate(
      { ...values, taskId },
      {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      }
    );
  };

  const startEdit = (entry: TimeEntry) => {
    setEditingId(entry.id);
    setEditMinutes(String(entry.minutes));
    setEditDescription(entry.description ?? '');
    setEditLogDate(entry.logDate);
  };

  const saveEdit = (id: string) => {
    updateEntry.mutate(
      {
        id,
        payload: {
          minutes: Number(editMinutes),
          description: editDescription,
          logDate: editLogDate,
        },
      },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const cancelEdit = () => setEditingId(null);

  // Convert minutes to hours and minutes display
  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Total minutes for this task
  const totalMinutes = Array.isArray(entries) ? entries.reduce((sum, e) => sum + e.minutes, 0) : 0;

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
            Time Tracking
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {totalMinutes > 0 && (
            <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
              Total: <span className="text-violet-400 font-semibold">{formatMinutes(totalMinutes)}</span>
            </span>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            <Plus size={12} />
            Log Time
          </button>
        </div>
      </div>

      {/* Log Time Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 bg-zinc-800 border border-zinc-700 rounded-lg p-4"
        >
          <div className="flex gap-3">
            {/* Minutes */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-zinc-400">Minutes</label>
              <input
                type="number"
                {...register('minutes', { valueAsNumber: true })}
                placeholder="e.g. 90"
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              {errors.minutes && (
                <p className="text-red-400 text-xs">{errors.minutes.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-zinc-400">Date</label>
              <input
                type="date"
                {...register('logDate')}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              {errors.logDate && (
                <p className="text-red-400 text-xs">{errors.logDate.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-400">Description (optional)</label>
            <input
              type="text"
              {...register('description')}
              placeholder="What did you work on?"
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowForm(false); reset(); }}
              className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEntry.isPending}
              className="text-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition"
            >
              {createEntry.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-zinc-700 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-zinc-700 rounded w-24" />
                <div className="h-3 bg-zinc-700 rounded w-40" />
              </div>
            </div>
          ))}
        </div>
      ) : entries?.length === 0 ? (
        <div className="text-zinc-600 text-sm text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          No time logged yet. Click Log Time to start.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries?.map((entry: TimeEntry) => (
            <div key={entry.id} className="flex gap-3 group items-start">

              {/* Minutes badge */}
              <div className="w-12 h-10 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-violet-400">
                  {formatMinutes(entry.minutes)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                {editingId === entry.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editMinutes}
                        onChange={e => setEditMinutes(e.target.value)}
                        className="w-24 bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                        placeholder="Minutes"
                      />
                      <input
                        type="date"
                        value={editLogDate}
                        onChange={e => setEditLogDate(e.target.value)}
                        className="bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="w-full bg-zinc-800 border border-violet-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(entry.id)}
                        disabled={updateEntry.isPending}
                        className="flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-2 py-1 rounded transition"
                      >
                        <Check size={12} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded transition"
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-white">
                      {entry.description ?? 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-zinc-500">{entry.logDate}</span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">{entry.user?.name}</span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-600">
                        {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions — only for entry owner */}
              {currentUserId === entry.userId && editingId !== entry.id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={() => startEdit(entry)}
                    className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => deleteEntry.mutate(entry.id)}
                    disabled={deleteEntry.isPending}
                    className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};