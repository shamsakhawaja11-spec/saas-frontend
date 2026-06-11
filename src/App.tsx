import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/loginpage';
import RegisterPage from './pages/auth/registerPage';
import ProtectedRoute from './components/layout/protectedRoute';
import DashboardLayout from './components/layout/Dashboardlayout';

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
              <div className="text-white text-2xl font-bold">
                Welcome to Dashboard 👋
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/workspaces" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-2xl font-bold">
                Workspaces — Coming Soon
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-white text-2xl font-bold">
                Projects — Coming Soon
              </div>
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