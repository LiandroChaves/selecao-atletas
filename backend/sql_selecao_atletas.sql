-- SELECTS
SELECT * FROM paises;
SELECT * FROM niveis_ambidestria;
SELECT * FROM posicoes;
SELECT * FROM clubes;
SELECT * FROM jogadores;
SELECT * FROM estatisticas_gerais;
SELECT * FROM partidas;
SELECT * FROM estatisticas_partidas;
SELECT * FROM historico_clubes;
SELECT * FROM historico_lesoes;
SELECT * FROM titulos;
SELECT * FROM jogadores_titulos;
SELECT * FROM agentes;
SELECT * FROM jogadores_agentes;


-- Tipos ENUM (melhor prática no PostgreSQL)
CREATE TYPE tipo_titulo AS ENUM ('Nacional', 'Internacional', 'Individual');
CREATE TYPE pe_dominante_enum AS ENUM ('D', 'E', 'A');

CREATE TABLE paises (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE niveis_ambidestria (
    id SMALLINT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posicoes (
    id SMALLINT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clubes (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    pais_id SMALLINT NOT NULL,
    fundacao SMALLINT,
    estadio VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_clubes_pais FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE jogadores (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    pais_id SMALLINT NOT NULL,
    altura DECIMAL(4,2) NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    pe_dominante pe_dominante_enum NOT NULL,
    nivel_ambidestria_id SMALLINT NOT NULL,
    posicao_id SMALLINT NOT NULL,
    clube_atual_id INT,
    contrato_inicio DATE,
    contrato_fim DATE,
    foto VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_jogadores_pais FOREIGN KEY (pais_id) REFERENCES paises(id),
    CONSTRAINT fkey_jogadores_nivel FOREIGN KEY (nivel_ambidestria_id) REFERENCES niveis_ambidestria(id),
    CONSTRAINT fkey_jogadores_posicao FOREIGN KEY (posicao_id) REFERENCES posicoes(id),
    CONSTRAINT fkey_jogadores_clube FOREIGN KEY (clube_atual_id) REFERENCES clubes(id)
);

CREATE TABLE estatisticas_gerais (
    jogador_id INT PRIMARY KEY,
    partidas_jogadas INT DEFAULT 0,
    gols INT DEFAULT 0,
    assistencias INT DEFAULT 0,
    titulos INT DEFAULT 0,
    faltas_cometidas INT DEFAULT 0,
    cartoes_amarelos INT DEFAULT 0,
    cartoes_vermelhos INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_estatisticas_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE
);

CREATE TABLE partidas (
    id INT PRIMARY KEY,
    data DATE NOT NULL,
    campeonato VARCHAR(255),
    estadio VARCHAR(255),
    clube_casa_id INT NOT NULL,
    clube_fora_id INT NOT NULL,
    gols_casa SMALLINT DEFAULT 0,
    gols_fora SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_partidas_clube_casa FOREIGN KEY (clube_casa_id) REFERENCES clubes(id),
    CONSTRAINT fkey_partidas_clube_fora FOREIGN KEY (clube_fora_id) REFERENCES clubes(id)
);

CREATE TABLE estatisticas_partidas (
    id INT PRIMARY KEY,
    jogador_id INT NOT NULL,
    partida_id INT NOT NULL,
    minutos_jogados SMALLINT DEFAULT 0,
    gols SMALLINT DEFAULT 0,
    assistencias SMALLINT DEFAULT 0,
    passes_certos SMALLINT DEFAULT 0,
    finalizacoes SMALLINT DEFAULT 0,
    finalizacoes_no_alvo SMALLINT DEFAULT 0,
    desarmes SMALLINT DEFAULT 0,
    faltas_cometidas SMALLINT DEFAULT 0,
    cartoes_amarelos SMALLINT DEFAULT 0,
    cartoes_vermelhos SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_estatisticas_partida_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    CONSTRAINT fkey_estatisticas_partida_partida FOREIGN KEY (partida_id) REFERENCES partidas(id) ON DELETE CASCADE
);

CREATE TABLE historico_clubes (
    id INT PRIMARY KEY,
    jogador_id INT NOT NULL,
    clube_id INT NOT NULL,
    data_entrada DATE,
    data_saida DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_historico_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    CONSTRAINT fkey_historico_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

CREATE TABLE historico_lesoes (
    id INT PRIMARY KEY,
    jogador_id INT NOT NULL,
    tipo_lesao VARCHAR(255) NOT NULL,
    data_inicio DATE NOT NULL,
    data_retorno DATE,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fkey_lesoes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE
);

CREATE TABLE titulos (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo tipo_titulo NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jogadores_titulos (
    jogador_id INT NOT NULL,
    titulo_id INT NOT NULL,
    ano SMALLINT NOT NULL,
    clube_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jogador_id, titulo_id),
    CONSTRAINT fkey_titulos_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    CONSTRAINT fkey_titulos_titulo FOREIGN KEY (titulo_id) REFERENCES titulos(id),
    CONSTRAINT fkey_titulos_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

CREATE TABLE agentes (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jogadores_agentes (
    jogador_id INT NOT NULL,
    agente_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (jogador_id, agente_id),
    CONSTRAINT fkey_agentes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
    CONSTRAINT fkey_agentes_agente FOREIGN KEY (agente_id) REFERENCES agentes(id)
);

-- Índices úteis
CREATE INDEX idx_jogadores_nome ON jogadores(nome);
CREATE INDEX idx_partidas_data ON partidas(data);
CREATE INDEX idx_estatisticas_partidas_jogador ON estatisticas_partidas(jogador_id);
CREATE INDEX idx_estatisticas_partidas_partida ON estatisticas_partidas(partida_id);

-- -- apagar e recriar tudo do zero
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;