import api from './axios';
import type{ Workspace,CreateWorkspaceDto,UpdateWorkspaceDto } from '../types/workspace.types';

export const createWorkspace=async(dto:CreateWorkspaceDto):Promise<Workspace>=>{
    const response=await api.post<Workspace>('/workspaces',dto);
    return response.data;
}
export const getWorkspaces=async(id:string):Promise<Workspace[]>=>{
    const response=await api.get<Workspace[]>('/workspaces');
    return response.data;
}
export const updateWorkspace=async(id:string,dto:UpdateWorkspaceDto):Promise<Workspace>=>{
    const response=await api.put<Workspace>(`/workspaces/${id}`,dto);
    return response.data;
}
export const deleteWorkspace=async(id:string):Promise<void>=>{
    await api.delete<Workspace>(`/workspaces/${id}`);
}