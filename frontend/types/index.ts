// Auth
export interface LoginPayload {
  email: string;
  senha: string;
}
export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

// Posicao
export interface Posicao {
  id: number;
  nome: string;
}

// NivelAmbidestria
export interface NivelAmbidestria {
  id: number;
  descricao: string;
}

// Bandeira
export interface Bandeira {
  id: number;
  nome: string;
  logo_bandeira: string;
}

// Pais
export interface Pais {
  id: number;
  nome: string;
  sigla?: string | null;
  bandeira_id?: number | null;
  bandeira?: Bandeira | null;
}

// Estado
export interface Estado {
  id: number;
  nome: string;
  uf: string;
  pais_id: number;
  pais?: Pais;
}

// Cidade
export interface Cidade {
  id: number;
  nome: string;
  estado_id?: number | null;
  pais_id?: number | null;
  estado?: Estado | null;
  pais?: Pais | null;
}

// LogoClube
export interface LogoClube {
  id: number;
  clube_id: number;
  url_logo: string;
}

// Clube
export interface Clube {
  id: number;
  nome: string;
  pais_id?: number | null;
  estado_id?: number | null;
  cidade_id?: number | null;
  fundacao?: number | null;
  estadio?: string | null;
  logo?: string | null;
  pais?: Pais | null;
  logos?: LogoClube[];
}

export interface EstatisticaGeral {
  id: number;
  jogador_id: number;
  temporada: string;
  clube_id?: number | null;
  clube?: Clube | null;
  partidas_jogadas: number;
  gols: number;
  assistencias: number;
  faltas_cometidas: number;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
}

// Jogador
export interface Jogador {
  id: number;
  nome: string;
  nome_curto?: string | null;
  apelido?: string | null;
  data_nascimento?: string | null;
  posicao_id: number;
  posicao_secundaria_id?: number | null;
  nivel_ambidestria_id: number;
  clube_atual_id?: number | null;
  pais_id?: number | null;
  estado_id?: number | null;
  cidade_id?: number | null;
  altura?: number | null;
  peso?: number | null;
  pe_dominante?: string | null;
  foto?: string | null;
  video?: string | null;
  observacoes?: string | null;
  posicao_principal?: Posicao;
  posicao_secundaria?: Posicao | null;
  nivel_ambidestria?: NivelAmbidestria | null;
  clube_atual?: Clube | null;
  pais?: Pais | null;
  estado?: Estado | null;
  cidade?: Cidade | null;
  caracteristicas?: Caracteristica[];
  estatisticas_gerais?: EstatisticaGeral[];
  lesoes?: Lesao[];
  historico_clubes?: HistoricoClube[];
  titulos?: JogadorTitulo[];
}

// Caracteristica
export interface Caracteristica {
  id: number;
  jogador_id: number;
  descricao: string;
  nota?: number | null;
}

// Lesao (HistoricoLesao)
export interface Lesao {
  id: number;
  jogador_id: number;
  tipo_lesao: string;
  data_inicio: string;
  data_retorno?: string | null;
  descricao?: string | null;
}

// HistoricoClube
export interface HistoricoClube {
  id: number;
  jogador_id: number;
  clube_id: number;
  data_entrada: number;
  data_saida?: number | null;
  jogos: number;
  categoria: string;
  clube?: Clube;
}

// Titulo
export interface Titulo {
  id: number;
  nome: string;
  tipo?: string | null;
}

// JogadorTitulo
export interface JogadorTitulo {
  id: number;
  jogador_id: number;
  titulo_id: number;
  clube_id?: number | null;
  ano?: number | null;
  titulo?: Titulo;
  clube?: Clube | null;
}

// Partida
export interface Partida {
  id: number;
  data: string;
  campeonato?: string | null;
  estadio?: string | null;
  clube_casa_id: number;
  clube_fora_id: number;
  gols_casa?: number | null;
  gols_fora?: number | null;
  clube_casa?: Clube;
  clube_fora?: Clube;
  estatisticas?: EstatisticaPartida[];
}

// EstatisticaPartida
export interface EstatisticaPartida {
  id: number;
  partida_id: number;
  jogador_id: number;
  gols: number;
  assistencias: number;
  minutos_jogados?: number | null;
  cartoes_amarelos: number;
  cartoes_vermelhos: number;
  nota?: number | null;
  jogador?: Jogador;
}

export interface PDFOptions {
  category: "Base" | "Amador" | "Profissional";
  clube_id?: number;
  temporada?: string;
  primaryColor: string;
  secondaryColor: string;
}
