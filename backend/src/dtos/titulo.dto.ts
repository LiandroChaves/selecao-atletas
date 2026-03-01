export interface CreateTituloDTO {
    nome: string;
    tipo: 'Nacional' | 'Internacional' | 'Individual';
}

export interface VincularTituloDTO {
    jogador_id: number;
    titulo_id: number;
    ano: number;
    clube_id: number;
}