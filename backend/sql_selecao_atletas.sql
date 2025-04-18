-- ENUMs
CREATE TYPE tipo_titulo AS ENUM ('Nacional', 'Internacional', 'Individual');
CREATE TYPE pe_dominante_enum AS ENUM ('D', 'E', 'A');

-- ========================
-- 1. Tabelas básicas
-- ========================

-- USUÁRIOS

-- SELECT * FROM usuarios;
-- -- DELETE FROM usuarios;

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAÍSES

-- SELECT * FROM paises;
-- -- DELETE FROM paises;
-- ALTER SEQUENCE paises_id_seq RESTART WITH 1;

CREATE TABLE paises (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- ESTADOS

-- SELECT * FROM estados;
-- -- DELETE FROM estados;
-- ALTER SEQUENCE estados_id_seq RESTART WITH 1;

CREATE TABLE estados (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	uf CHAR(2) NOT NULL,
	pais_id INT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_estados_pais FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE CASCADE
);

-- CIDADES

-- SELECT * FROM cidades;
-- -- DELETE FROM cidades;
-- ALTER SEQUENCE cidades_id_seq RESTART WITH 1;

CREATE TABLE cidades (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	pais_id SMALLINT,
	estado_id SMALLINT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_cidades_pais FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE CASCADE,
	CONSTRAINT fkey_cidades_estado FOREIGN KEY (estado_id) REFERENCES estados(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- NÍVEIS DE AMBIDESTRIA

-- SELECT * FROM niveis_ambidestria;
-- -- DELETE FROM niveis_ambidestria;
-- ALTER SEQUENCE niveis_ambidestria_id_seq RESTART WITH 1;

CREATE TABLE niveis_ambidestria (
	id SERIAL PRIMARY KEY,
	descricao VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- POSIÇÕES

-- SELECT * FROM posicoes;
-- -- DELETE FROM posicoes;
-- ALTER SEQUENCE posicoes_id_seq RESTART WITH 1;

CREATE TABLE posicoes (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 2. Clubes
-- ========================

SELECT * FROM clubes;
-- -- DELETE FROM clubes;
-- ALTER SEQUENCE clubes_id_seq RESTART WITH 1;

CREATE TABLE clubes (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	pais_id SMALLINT NOT NULL,
	fundacao SMALLINT,
	estadio VARCHAR(255),
	inicio_contrato DATE,
	fim_contrato DATE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_clubes_pais FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ========================
-- 3. Jogadores
-- ========================

-- SELECT * FROM jogadores;
-- -- DELETE FROM jogadores;
-- ALTER SEQUENCE jogadores_id_seq RESTART WITH 1;

CREATE TABLE jogadores (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	apelido VARCHAR(255),
	data_nascimento DATE NOT NULL,
	pais_id SMALLINT NOT NULL,
	estado_id SMALLINT,
	cidade_id SMALLINT NOT NULL,
	altura DECIMAL(4,2) NOT NULL,
	peso DECIMAL(5,2) NOT NULL,
	pe_dominante pe_dominante_enum NOT NULL,
	nivel_ambidestria_id SMALLINT NOT NULL,
	posicao_id SMALLINT NOT NULL,
	posicao_secundaria_id SMALLINT,
	clube_atual_id INT,
	contrato_inicio DATE,
	contrato_fim DATE,
	foto VARCHAR(255),
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_jogadores_pais FOREIGN KEY (pais_id) REFERENCES paises(id),
	CONSTRAINT fkey_jogadores_estado FOREIGN KEY (estado_id) REFERENCES estados(id) ON DELETE SET NULL,
	CONSTRAINT fkey_jogadores_cidade FOREIGN KEY (cidade_id) REFERENCES cidades(id) ON DELETE SET NULL,
	CONSTRAINT fkey_jogadores_nivel FOREIGN KEY (nivel_ambidestria_id) REFERENCES niveis_ambidestria(id),
	CONSTRAINT fkey_jogadores_posicao FOREIGN KEY (posicao_id) REFERENCES posicoes(id),
	CONSTRAINT fkey_jogadores_posicao_secundaria FOREIGN KEY (posicao_secundaria_id) REFERENCES posicoes(id),
	CONSTRAINT fkey_jogadores_clube FOREIGN KEY (clube_atual_id) REFERENCES clubes(id)
);

-- ========================
-- 3.1 Características principais
-- ========================

-- SELECT * FROM caracteristicas_principais;
-- -- DELETE FROM caracteristicas_principais;
-- ALTER SEQUENCE caracteristicas_principais_id_seq RESTART WITH 1;

CREATE TABLE caracteristicas_principais (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	descricao VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE
);

-- ========================
-- 4. Estatísticas Gerais
-- ========================

-- SELECT * FROM estatisticas_gerais;
-- -- DELETE FROM estatisticas_gerais;

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

-- ========================
-- 5. Partidas
-- ========================

-- SELECT * FROM partidas;
-- -- DELETE FROM partidas;
-- ALTER SEQUENCE partidas_id_seq RESTART WITH 1;

CREATE TABLE partidas (
	id SERIAL PRIMARY KEY,
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

-- ========================
-- Estatísticas por Partida
-- ========================

-- SELECT * FROM estatisticas_partidas;
-- -- DELETE FROM estatisticas_partidas;

CREATE TABLE estatisticas_partidas (
	id SERIAL PRIMARY KEY,
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

-- ========================
-- 6. Histórico de Clubes
-- ========================

-- SELECT * FROM historico_clubes;
-- -- DELETE FROM historico_clubes;

CREATE TABLE historico_clubes (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	clube_id INT NOT NULL,
	data_entrada DATE NOT NULL,
	data_saida DATE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_historico_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
	CONSTRAINT fkey_historico_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- ========================
-- Histórico de Lesões
-- ========================

-- SELECT * FROM historico_lesoes;
-- -- DELETE FROM historico_lesoes;

CREATE TABLE historico_lesoes (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	tipo_lesao VARCHAR(255) NOT NULL,
	data_inicio DATE NOT NULL,
	data_retorno DATE,
	descricao TEXT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_lesoes_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE
);

-- ========================
-- 7. Títulos
-- ========================

-- SELECT * FROM titulos;
-- -- DELETE FROM titulos;

CREATE TABLE titulos (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	tipo tipo_titulo NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- SELECT * FROM jogadores_titulos;
-- -- DELETE FROM jogadores_titulos;

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


-- 8. Índices

CREATE INDEX idx_jogadores_nome ON jogadores(nome);
CREATE INDEX idx_partidas_data ON partidas(data);
CREATE INDEX idx_estatisticas_partidas_jogador ON estatisticas_partidas(jogador_id);
CREATE INDEX idx_estatisticas_partidas_partida ON estatisticas_partidas(partida_id);
CREATE INDEX idx_jogadores_cidade ON jogadores(cidade_id);

-- -- apagar e recriar tudo do zero
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;