export interface CreateBandeiraDTO {
    nome: string;
    logo_bandeira: string;
}

export interface CreatePaisDTO {
    nome: string;
    bandeira_id?: number;
}

export interface CreateEstadoDTO {
    nome: string;
    uf: string;
    pais_id: number;
}

export interface CreateCidadeDTO {
    nome: string;
    pais_id?: number;
    estado_id?: number;
}