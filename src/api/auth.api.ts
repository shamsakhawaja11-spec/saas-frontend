import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';
import api from './axios';

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('auth/register', data);
  return response.data;
};

export const getMe = async (): Promise<AuthResponse['user']> => {
  const response = await api.get<AuthResponse['user']>('auth/me');
  return response.data;
};