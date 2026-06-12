// src/pages/DashboardPage.tsx

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Plus,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { getWorkspaces } from '../api/workspaces.api';
import useAuthStore from '../store/auth.store';

// ─── Stat Card ───────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-dark-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
    </div>
  </div>
);

// ─── Skeleton ────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-dark-800 border border-slate-700 rounded-xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-slate-700" />
      <div className="h-4 bg-slate-700 rounded w-1/2" />
    </div>
    <div className="h-3 bg-slate-700 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-700 rounded w-1/2" />
  </div>
);

// ─── Dashboard Page ──────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: workspaces = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    staleTime: 1000 * 60 * 5,
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-dark-900 text-white">

      {/* ── Header ── */}
      <div className="border-b border-slate-700 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-primary-500" />
            <div>
              <h1 className="text-lg font-bold text-white">
                {greeting}, {user?.name ?? 'there'} 👋
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of your workspaces and projects
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/workspaces')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition active:scale-95"
          >
            <Plus size={16} />
            New Workspace
          </button>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Building2}
            label="Workspaces"
            value={isLoading ? '...' : workspaces.length}
            color="bg-primary-600"
          />
          <StatCard
            icon={FolderKanban}
            label="Projects"
            value="—"
            color="bg-violet-600"
          />
          <StatCard
            icon={Layers}
            label="Boards"
            value="—"
            color="bg-sky-600"
          />
          <StatCard
            icon={CheckSquare}
            label="My Tasks"
            value="—"
            color="bg-emerald-600"
          />
        </div>

        {/* ── Workspaces ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Your Workspaces
            </h2>
            <button
              onClick={() => navigate('/workspaces')}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 font-medium transition"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-5">
              <p className="text-red-400 font-semibold text-sm">
                Failed to load workspaces
              </p>
              <p className="text-red-500 text-xs mt-1">
                {(error as Error)?.message ?? 'Something went wrong'}
              </p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && workspaces.length === 0 && (
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
              <Building2 size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">
                No workspaces yet
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Create your first workspace to get started
              </p>
              <button
                onClick={() => navigate('/workspaces')}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
              >
                <Plus size={15} />
                Create Workspace
              </button>
            </div>
          )}

          {/* Cards */}
          {!isLoading && !isError && workspaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                  className="bg-dark-800 border border-slate-700 rounded-xl p-5 hover:border-primary-600 hover:bg-dark-700 transition cursor-pointer group"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center shrink-0">
                      <span className="text-primary-400 font-bold text-sm uppercase">
                        {workspace.name.slice(0, 2)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate">
                      {workspace.name}
                    </h3>
                  </div>

                  {/* Description */}
                  {workspace.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {workspace.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-slate-600 group-hover:text-primary-400 transition"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;