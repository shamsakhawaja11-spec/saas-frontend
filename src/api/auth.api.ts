import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.type';
import api from './axios';
export const loginApi=async(data:LoginRequest):Promise<AuthResponse>=>{
    const response=await api.post<{data:AuthResponse}>('auth/login',data);
    return response.data.data;
}
export const registerApi=async(data:RegisterRequest):Promise<AuthResponse>=>{
    const response=await api.post<{data:AuthResponse}>('auth/register',data);
    return response.data.data;
}
export const getMe=async():Promise<AuthResponse['user']>=>{
    const response=await api<{data:AuthResponse['user']}>('auth/me');
    return response.data.data;
}