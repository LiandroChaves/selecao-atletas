export interface CreatePartidaDTO {
    data: string;
    campeonato?: string;
    estadio?: string;
    clube_casa_id: number;
    clube_fora_id: number;
    gols_casa?: number;
    gols_fora?: number;
}

export interface CreateEstatisticaPartidaDTO {
    jogador_id: number;
    partida_id: number;
    minutos_jogados?: number;
    gols?: number;
    assistencias?: number;
    passes_totais?: number;
    passes_certos?: number;
    passes_errados?: number;
    finalizacoes?: number;
    finalizacoes_alvo?: number;
    desarmes?: number;
    faltas_cometidas?: number;
    cartoes_amarelos?: number;
    cartoes_vermelhos?: number;
}