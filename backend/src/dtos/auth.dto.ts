export interface LoginDTO {
    email: string;
    senha: string;
}

export interface AuthResponseDTO {
    usuario: {
        id: number;
        email: string;
    };
    token: string;
}