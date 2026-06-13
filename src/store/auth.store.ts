import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') return null;
    return token;
  } catch {
    return null;
  }
};

const useAuthStore = create<AuthState>((set) => ({
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

export default useAuthStore;