export interface Workspace {
    id:string;
    name:string;
    description?:string;
    ownerId:string;
    createdAt:string;
    updatedAt:string;
}
export interface CreateWorkspaceDto {
    name:string;
    description?:string;
}
export interface UpdateWorkspaceDto {
    name?:string;
    description?:string;
}