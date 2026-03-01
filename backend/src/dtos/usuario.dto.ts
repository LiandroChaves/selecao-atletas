export interface CreateUsuarioDTO {
    email: string;
    senha: string;
}

export interface UsuarioResponseDTO {
    id: number;
    email: string;
    created_at: Date;
}