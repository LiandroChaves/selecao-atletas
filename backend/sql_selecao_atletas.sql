CREATE TABLE paises (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE niveis_ambidestria (
    id SMALLINT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

CREATE TABLE posicoes (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE clubes (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    pais_id SMALLINT,
    fundacao SMALLINT,
    estadio VARCHAR(255),
    CONSTRAINT fkey_clubes_pais FOREIGN KEY (pais_id) REFERENCES paises(id)
);

CREATE TABLE jogadores (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    pais_id SMALLINT,
    altura DECIMAL(4,2),
    peso DECIMAL(5,2),
    pe_dominante VARCHAR(1) CHECK (pe_dominante IN ('D', 'E', 'A')),
    nivel_ambidestria_id SMALLINT,
    posicao_id SMALLINT,
    clube_atual_id INT,
    contrato_inicio DATE,
    contrato_fim DATE,
    foto VARCHAR(255),
    CONSTRAINT fkey_jogadores_pais FOREIGN KEY (pais_id) REFERENCES paises(id),
    CONSTRAINT fkey_jogadores_nivel FOREIGN KEY (nivel_ambidestria_id) REFERENCES niveis_ambidestria(id),
    CONSTRAINT fkey_jogadores_posicao FOREIGN KEY (posicao_id) REFERENCES posicoes(id),
    CONSTRAINT fkey_jogadores_clube FOREIGN KEY (clube_atual_id) REFERENCES clubes(id)
);

CREATE TABLE estatisticas_gerais (
    jogador_id INT PRIMARY KEY,
    partidas_jogadas INT,
    gols INT,
    assistencias INT,
    titulos INT,
    faltas_cometidas INT,
    cartoes_amarelos INT,
    cartoes_vermelhos INT,
    CONSTRAINT fkey_estatisticas_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id)
);

CREATE TABLE partidas (
    id INT PRIMARY KEY,
    data DATE NOT NULL,
    campeonato VARCHAR(255),
    estadio VARCHAR(255),
    clube_casa_id INT,
    clube_fora_id INT,
    gols_casa SMALLINT,
    gols_fora SMALLINT,
    CONSTRAINT fkey_partidas_clube_casa FOREIGN KEY (clube_casa_id) REFERENCES clubes(id),
    CONSTRAINT fkey_partidas_clube_fora FOREIGN KEY (clube_fora_id) REFERENCES clubes(id)
);

CREATE TABLE estatisticas_partidas (
    id INT PRIMARY KEY,
    jogador_id INT,
    partida_id INT,
    minutos_jogados SMALLINT,
    gols SMALLINT,
    assistencias SMALLINT,
    passes_certos SMALLINT,
    finalizacoes SMALLINT,
    finalizacoes_no_alvo SMALLINT,
    desarmes SMALLINT,
    faltas_cometidas SMALLINT,
    cartoes_amarelos SMALLINT,
    cartoes_vermelhos SMALLINT,
    CONSTRAINT fkey_estatisticas_partida_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id),
    CONSTRAINT fkey_estatisticas_partida_partida FOREIGN KEY (partida_id) REFERENCES partidas(id)
);

CREATE TABLE historico_clubes (
    id INT PRIMARY KEY,
    jogador_id INT,
    clube_id INT,
    data_entrada DATE,
    data_saida DATE,
    CONSTRAINT fkey_historico_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id),
    CONSTRAINT fkey_historico_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

CREATE TABLE historico_lesoes (
    id INT PRIMARY KEY,
    jogador_id INT,
    tipo_lesao VARCHAR(255),
    data_inicio DATE,
    data_retorno DATE,
    descricao TEXT,
    CONSTRAINT fkey_lesoes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id)
);

CREATE TABLE titulos (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('Nacional', 'Internacional', 'Individual'))
);

CREATE TABLE jogadores_titulos (
    jogador_id INT,
    titulo_id INT,
    ano SMALLINT,
    clube_id INT,
    PRIMARY KEY (jogador_id, titulo_id),
    CONSTRAINT fkey_titulos_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id),
    CONSTRAINT fkey_titulos_titulo FOREIGN KEY (titulo_id) REFERENCES titulos(id),
    CONSTRAINT fkey_titulos_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

CREATE TABLE agentes (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255)
);

CREATE TABLE jogadores_agentes (
    jogador_id INT,
    agente_id INT,
    PRIMARY KEY (jogador_id, agente_id),
    CONSTRAINT fkey_agentes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id),
    CONSTRAINT fkey_agentes_agente FOREIGN KEY (agente_id) REFERENCES agentes(id)
);
