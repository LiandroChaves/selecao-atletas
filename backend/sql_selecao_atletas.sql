-- 1. Usuários
SELECT * FROM usuarios;
-- 2. Bandeiras
SELECT * FROM bandeiras;
-- 3. Países
SELECT * FROM paises;
-- 4. Estados
SELECT * FROM estados;
-- 5. Cidades
SELECT * FROM cidades;
-- 6. Níveis de Ambidestria
SELECT * FROM niveis_ambidestria;
-- 7. Posições
SELECT * FROM posicoes;
-- 8. Clubes
SELECT * FROM clubes;
-- 9. Logos dos Clubes
SELECT * FROM logos_clubes;
-- 10. Jogadores
SELECT * FROM jogadores;
-- 11. Características dos Jogadores
SELECT * FROM caracteristicas;
-- 12. Estatísticas Gerais dos Jogadores
SELECT * FROM estatisticas_gerais;
-- 13. Partidas
SELECT * FROM partidas;
-- 14. Estatísticas por Partida
SELECT * FROM estatisticas_partidas;
-- 15. Histórico de Clubes dos Jogadores
SELECT * FROM historico_clubes;
-- 16. Histórico de Lesões dos Jogadores
SELECT * FROM historico_lesoes;
-- 17. Títulos
SELECT * FROM titulos;
-- 18. Relação Jogadores x Títulos
SELECT * FROM jogadores_titulos;

-- ========================
-- ENUMs
-- ========================

CREATE TYPE tipo_titulo AS ENUM ('Nacional', 'Internacional', 'Individual');
CREATE TYPE pe_dominante_enum AS ENUM ('D', 'E', 'A');

-- ========================
-- 1. Tabelas básicas
-- ========================

-- USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAÍSES
CREATE TABLE IF NOT EXISTS bandeiras (
	id SERIAL PRIMARY KEY NOT NULL,
	nome VARCHAR(255) NOT NULL,
	logo_bandeira TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paises (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	bandeira_id INT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_paises_bandeira FOREIGN KEY (bandeira_id) REFERENCES bandeiras(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ESTADOS
CREATE TABLE IF NOT EXISTS estados (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	uf CHAR(2) NOT NULL,
	pais_id INT,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_estados_pais FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE CASCADE
);

-- CIDADES
CREATE TABLE IF NOT EXISTS cidades (
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
CREATE TABLE IF NOT EXISTS niveis_ambidestria (
	id SERIAL PRIMARY KEY,
	descricao VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- POSIÇÕES
CREATE TABLE IF NOT EXISTS posicoes (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- 2. Clubes
-- ========================

CREATE TABLE IF NOT EXISTS clubes (
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

CREATE TABLE IF NOT EXISTS logos_clubes (
	id SERIAL PRIMARY KEY,
	clube_id INT NOT NULL,
	url_logo VARCHAR(500) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_logos_clube FOREIGN KEY (clube_id) REFERENCES clubes(id) ON DELETE CASCADE
);

-- ========================
-- 3. Jogadores
-- ========================

CREATE TABLE IF NOT EXISTS jogadores (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	nome_curto VARCHAR(255),
	apelido VARCHAR(255),
	data_nascimento DATE,
	pais_id SMALLINT,
	estado_id SMALLINT,
	cidade_id SMALLINT,
	altura DECIMAL(4,2),
	peso DECIMAL(5,2),
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

ALTER TABLE jogadores
ALTER COLUMN clube_atual_id DROP NOT NULL;

-- Características principais
CREATE TABLE IF NOT EXISTS caracteristicas (
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

CREATE TABLE IF NOT EXISTS estatisticas_gerais (
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
-- 5. Partidas & Estatísticas
-- ========================

CREATE TABLE IF NOT EXISTS partidas (
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

CREATE TABLE IF NOT EXISTS estatisticas_partidas (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	partida_id INT NOT NULL,
	minutos_jogados SMALLINT DEFAULT 0,
	gols SMALLINT DEFAULT 0,
	assistencias SMALLINT DEFAULT 0,
	passes_totais SMALLINT DEFAULT 0,
	passes_certos SMALLINT DEFAULT 0,
	passes_errados SMALLINT DEFAULT 0,
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
-- 6. Histórico
-- ========================

CREATE TABLE IF NOT EXISTS historico_clubes (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	clube_id INT NOT NULL,
	data_entrada INT NOT NULL,
	data_saida INT,
	jogos INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	categoria VARCHAR(20) DEFAULT 'Profissional',
	CONSTRAINT fkey_historico_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
	CONSTRAINT fkey_historico_clube FOREIGN KEY (clube_id) REFERENCES clubes(id)
);

-- Adicionar campo categoria na tabela historico_clubes
ALTER TABLE historico_clubes 
ADD COLUMN categoria VARCHAR(20) DEFAULT 'Profissional' CHECK (categoria IN ('Amador', 'Profissional', 'Base'));

CREATE TABLE IF NOT EXISTS historico_lesoes (
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

CREATE TABLE IF NOT EXISTS titulos (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	tipo tipo_titulo NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jogadores_titulos (
	id SERIAL PRIMARY KEY,
	jogador_id INT NOT NULL,
	titulo_id INT NOT NULL,
	ano SMALLINT NOT NULL,
	clube_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fkey_titulos_jogador FOREIGN KEY (jogador_id) REFERENCES jogadores(id) ON DELETE CASCADE,
	CONSTRAINT fkey_titulos_titulo FOREIGN KEY (titulo_id) REFERENCES titulos(id),
	CONSTRAINT fkey_titulos_clube FOREIGN KEY (clube_id) REFERENCES clubes(id),
	CONSTRAINT unique_jogador_titulo UNIQUE (jogador_id, titulo_id)
);

-- ========================
-- 8. Índices
-- ========================

CREATE INDEX IF NOT EXISTS idx_jogadores_nome ON jogadores(nome);
CREATE INDEX IF NOT EXISTS idx_partidas_data ON partidas(data);
CREATE INDEX IF NOT EXISTS idx_estatisticas_partidas_jogador ON estatisticas_partidas(jogador_id);
CREATE INDEX IF NOT EXISTS idx_estatisticas_partidas_partida ON estatisticas_partidas(partida_id);
CREATE INDEX IF NOT EXISTS idx_jogadores_cidade ON jogadores(cidade_id);

-- ========================
-- 9. Consulta Geral de Termo
-- ========================

DO $$
DECLARE
    r RECORD;
    query TEXT;
    termo TEXT := '1969';
    resultado INT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND data_type NOT IN ('bytea')
    LOOP
        query := format(
            'SELECT COUNT(*) FROM %I.%I WHERE %I::text ILIKE %L',
            r.table_schema,
            r.table_name,
            r.column_name,
            '%' || termo || '%'
        );

        EXECUTE query INTO resultado;

        IF resultado > 0 THEN
            RAISE NOTICE '🔎 Encontrado % ocorrências em %.% coluna %',
                resultado, r.table_schema, r.table_name, r.column_name;
        END IF;
    END LOOP;
END
$$ LANGUAGE plpgsql;

-- ========================
-- 10. DROP/RESET opcional
-- ========================

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;







-- Script para verificar os dados de logos dos clubes
SELECT 
    c.id as clube_id,
    c.nome as clube_nome,
    lc.id as logo_id,
    lc.url_logo,
    lc.created_at as logo_created_at
FROM clubes c
LEFT JOIN logos_clubes lc ON c.id = lc.clube_id
ORDER BY c.id;

-- Verificar se há logos órfãs
SELECT 
    lc.*,
    c.nome as clube_nome
FROM logos_clubes lc
LEFT JOIN clubes c ON lc.clube_id = c.id
WHERE c.id IS NULL;

-- Contar clubes com e sem logo
SELECT 
    'Com logo' as status,
    COUNT(*) as quantidade
FROM clubes c
INNER JOIN logos_clubes lc ON c.id = lc.clube_id

UNION ALL

SELECT 
    'Sem logo' as status,
    COUNT(*) as quantidade
FROM clubes c
LEFT JOIN logos_clubes lc ON c.id = lc.clube_id
WHERE lc.id IS NULL;