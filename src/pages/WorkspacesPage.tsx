import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../api/workspaces.api';

const WorkspacesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // ── Fetch all workspaces ──
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });

  // ── Create workspace ──
  const createMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setShowModal(false);
      setName('');
      setDescription('');
      setError('');
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to create workspace');
    },
  });

  // ── Delete workspace ──
  const deleteMutation = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    createMutation.mutate({ name, description });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">

      {/* ── Header ── */}
      <div className="border-b border-slate-700 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-primary-500" />
          <div>
            <h1 className="text-lg font-bold text-white">Workspaces</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus size={16} />
          New Workspace
        </button>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-8">

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary-500" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && workspaces.length === 0 && (
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-14 text-center">
            <Building2 size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No workspaces yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Create your first workspace to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition"
            >
              <Plus size={15} />
              Create Workspace
            </button>
          </div>
        )}

        {/* Workspace Cards */}
        {!isLoading && workspaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-dark-800 border border-slate-700 rounded-xl p-5 hover:border-primary-600 transition group"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center shrink-0">
                      <span className="text-primary-400 font-bold text-sm uppercase">
                        {workspace.name.slice(0, 2)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {workspace.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteMutation.mutate(workspace.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Description */}
                {workspace.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {workspace.description}
                  </p>
                )}

                {/* Footer */}
                <div
                  onClick={() => navigate(`/workspaces/${workspace.id}/projects`)}
                  className="flex items-center justify-between pt-3 border-t border-slate-700 cursor-pointer"
                >
                  <span className="text-xs text-slate-500">
                    {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300">
                    View Projects
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-5">
              Create Workspace
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Company"
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this workspace for?"
                rows={3}
                className="w-full bg-dark-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 transition resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs mb-4">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError('');
                  setName('');
                  setDescription('');
                }}
                className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
              >
                {createMutation.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;