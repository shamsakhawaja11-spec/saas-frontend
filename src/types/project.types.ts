export interface Project{
    id:string;
    name:string;
    description?:string;
    createdAt:string;
    updatedAt:string;
    workspaceId:string;
}
export interface CreateProjectDto{
    name:string;
    description?:string;
}
export interface UpdateProjectDto{
    name?:string;
    description?:string;
}