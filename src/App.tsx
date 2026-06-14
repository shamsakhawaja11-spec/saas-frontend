import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import WorkspacesPage from './pages/WorkspacesPage';
import ProjectsPage from './pages/ProjectsPage';
import BoardsPage from './pages/BoardsPage';
import KanbanPage from './pages/KanbanPage';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />


      <Route path="/workspaces" element={
        <ProtectedRoute>
          <DashboardLayout>
            <WorkspacesPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />


<Route path="/projects/:projectId/boards" element={
  <ProtectedRoute>
    <DashboardLayout>
      <BoardsPage />
    </DashboardLayout>
  </ProtectedRoute>
} />
      <Route path="/workspaces/:workspaceId/projects" element={
  <ProtectedRoute>
    <DashboardLayout>
      <ProjectsPage />
    </DashboardLayout>
  </ProtectedRoute>
} />
<Route path="/boards/:boardId/kanban" element={
  <ProtectedRoute>
    <DashboardLayout>
      <KanbanPage />
    </DashboardLayout>
  </ProtectedRoute>
} />

        <Route path="/boards" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-2xl font-bold">
                Boards — Coming Soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-2xl font-bold">
                Tasks — Coming Soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
};

export default App;