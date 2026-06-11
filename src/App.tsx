import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes — will add more pages here later */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="text-white text-center mt-20 text-2xl">
              Dashboard — Coming Soon
            </div>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
};

export default App;