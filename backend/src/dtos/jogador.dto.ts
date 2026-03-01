export interface CreateJogadorDTO {
    nome: string;
    nome_curto?: string;
    apelido?: string;
    data_nascimento?: string;
    pe_dominante: 'D' | 'E' | 'A';
    nivel_ambidestria_id: number;
    posicao_id: number;
    posicao_secundaria_id?: number;
    clube_atual_id?: number;
    altura?: number;
    peso?: number;
    pais_id?: number;
    estado_id?: number;
    cidade_id?: number;
    video?: string;
    observacoes?: string;
}