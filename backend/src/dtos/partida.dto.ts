export interface CreatePartidaDTO {
    data: string;
    campeonato?: string;
    estadio?: string;
    clube_casa_id: number;
    clube_fora_id: number;
    gols_casa?: number;
    gols_fora?: number;
}

export interface AddEstatisticaJogadorDTO {
    jogador_id: number;
    partida_id: number;
    minutos_jogados?: number;
    gols?: number;
    assistencias?: number;
    passes_totais?: number;
    passes_certos?: number;
    finalizacoes?: number;
    desarmes?: number;
    cartoes_amarelos?: number;
    cartoes_vermelhos?: number;
}