export interface CreateHistoricoClubeDTO {
    jogador_id: number;
    clube_id: number;
    data_entrada: number;
    data_saida?: number;
    jogos?: number;
    categoria?: string;
}

export interface CreateLesaoDTO {
    jogador_id: number;
    tipo_lesao: string;
    data_inicio: string;
    data_retorno?: string;
    descricao?: string;
}