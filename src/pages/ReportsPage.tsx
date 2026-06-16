import { useState } from 'react';
import { BarChart3, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { useTaskSummary, useOverdueTasks, useUserProductivity, useTimeSummary } from '../hooks/useReports';
import useAuthStore from '../store/auth.store';

const ReportsPage = () => {
  const { user } = useAuthStore();
  const [boardId, setBoardId] = useState('');
  const [boardIdInput, setBoardIdInput] = useState('');

  const { data: taskSummary, isLoading: loadingTask } = useTaskSummary(boardId);
  const { data: overdueTasks, isLoading: loadingOverdue } = useOverdueTasks(boardId);
  const { data: productivity, isLoading: loadingProductivity } = useUserProductivity(boardId);
  const { data: timeSummary, isLoading: loadingTime } = useTimeSummary(user?.id ?? '');

  const handleSearch = () => {
    setBoardId(boardIdInput.trim());
  };

  return (
    <div className="p-6 flex flex-col gap-8">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <BarChart3 size={24} className="text-violet-400" />
        <div>
          <h1 className="text-xl font-bold text-white">Reports</h1>
          <p className="text-sm text-zinc-500">Analytics and insights for your boards</p>
        </div>
      </div>

      {/* Board ID Input */}
      <div className="flex gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Board ID</label>
          <input
            type="text"
            value={boardIdInput}
            onChange={e => setBoardIdInput(e.target.value)}
            placeholder="Enter board ID..."
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition w-72"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Load Reports
        </button>
      </div>

      {/* My Time Summary — always visible */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">My Time Summary</h2>
        </div>
        {loadingTime ? (
          <div className="animate-pulse h-8 bg-zinc-700 rounded w-32" />
        ) : timeSummary ? (
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold text-white">{timeSummary.formattedTime}</p>
              <p className="text-xs text-zinc-500 mt-1">Total time logged</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-violet-400">{timeSummary.totalMinutes}</p>
              <p className="text-xs text-zinc-500 mt-1">Total minutes</p>
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No time data available.</p>
        )}
      </div>

      {/* Board Reports — only when boardId is set */}
      {boardId && (
        <div className="flex flex-col gap-6">

          {/* Task Summary */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Task Summary</h2>
            </div>
            {loadingTask ? (
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse h-16 bg-zinc-700 rounded-lg" />
                ))}
              </div>
            ) : taskSummary ? (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total', value: taskSummary.total, color: 'text-white' },
                  { label: 'To Do', value: taskSummary.todo, color: 'text-zinc-400' },
                  { label: 'In Progress', value: taskSummary.inProgress, color: 'text-blue-400' },
                  { label: 'In Review', value: taskSummary.inReview, color: 'text-yellow-400' },
                  { label: 'Done', value: taskSummary.done, color: 'text-green-400' },
                  { label: 'Overdue', value: taskSummary.overdue, color: 'text-red-400' },
                ].map(item => (
                  <div key={item.label} className="bg-zinc-800 rounded-lg p-4">
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-zinc-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">No task data found for this board.</p>
            )}
          </div>

          {/* Overdue Tasks */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-400" />
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
                Overdue Tasks {overdueTasks && overdueTasks.length > 0 && (
                  <span className="text-red-400 ml-1">({overdueTasks.length})</span>
                )}
              </h2>
            </div>
            {loadingOverdue ? (
              <div className="flex flex-col gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse h-10 bg-zinc-700 rounded-lg" />
                ))}
              </div>
            ) : overdueTasks?.length === 0 ? (
              <p className="text-zinc-600 text-sm">No overdue tasks. Great job!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {overdueTasks?.map(task => (
                  <div key={task.id} className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3">
                    <p className="text-sm text-white">{task.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{task.status}</span>
                      <span className="text-xs text-red-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Productivity */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-violet-400" />
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">User Productivity</h2>
            </div>
            {loadingProductivity ? (
              <div className="flex flex-col gap-2">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse h-10 bg-zinc-700 rounded-lg" />
                ))}
              </div>
            ) : productivity?.length === 0 ? (
              <p className="text-zinc-600 text-sm">No completed tasks found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {productivity?.map(p => (
                  <div key={p.userId} className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm text-white">{p.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Completed</span>
                      <span className="text-sm font-bold text-green-400">{p.completed}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Empty state when no boardId */}
      {!boardId && (
        <div className="text-center py-16 border border-dashed border-zinc-700 rounded-xl">
          <BarChart3 size={40} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Enter a Board ID above to load board reports.</p>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;