export interface CreateClubeDTO {
    nome: string;
    pais_id: number;
    fundacao?: number;
    estadio?: string;
}

export interface ClubeResponseDTO {
    id: number;
    nome: string;
    pais_id: number;
    fundacao: number | null;
    estadio: string | null;
    logo_url?: string;
}