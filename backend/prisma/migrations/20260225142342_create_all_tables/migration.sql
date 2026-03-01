-- CreateEnum
CREATE TYPE "TipoTitulo" AS ENUM ('Nacional', 'Internacional', 'Individual');

-- CreateEnum
CREATE TYPE "PeDominante" AS ENUM ('D', 'E', 'A');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bandeiras" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "logo_bandeira" TEXT NOT NULL,

    CONSTRAINT "bandeiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paises" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "bandeira_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "pais_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pais_id" INTEGER,
    "estado_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveis_ambidestria" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "niveis_ambidestria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posicoes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "posicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pais_id" INTEGER NOT NULL,
    "fundacao" INTEGER,
    "estadio" TEXT,
    "inicio_contrato" TIMESTAMP(3),
    "fim_contrato" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logos_clubes" (
    "id" SERIAL NOT NULL,
    "clube_id" INTEGER NOT NULL,
    "url_logo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logos_clubes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nome_curto" TEXT,
    "apelido" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "pais_id" INTEGER,
    "estado_id" INTEGER,
    "cidade_id" INTEGER,
    "altura" DECIMAL(4,2),
    "peso" DECIMAL(5,2),
    "pe_dominante" "PeDominante" NOT NULL,
    "nivel_ambidestria_id" INTEGER NOT NULL,
    "posicao_id" INTEGER NOT NULL,
    "posicao_secundaria_id" INTEGER,
    "clube_atual_id" INTEGER,
    "foto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estatisticas_gerais" (
    "jogador_id" INTEGER NOT NULL,
    "partidas_jogadas" INTEGER NOT NULL DEFAULT 0,
    "gols" INTEGER NOT NULL DEFAULT 0,
    "assistencias" INTEGER NOT NULL DEFAULT 0,
    "titulos" INTEGER NOT NULL DEFAULT 0,
    "faltas_cometidas" INTEGER NOT NULL DEFAULT 0,
    "cartoes_amarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoes_vermelhos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estatisticas_gerais_pkey" PRIMARY KEY ("jogador_id")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "campeonato" TEXT,
    "estadio" TEXT,
    "clube_casa_id" INTEGER NOT NULL,
    "clube_fora_id" INTEGER NOT NULL,
    "gols_casa" INTEGER NOT NULL DEFAULT 0,
    "gols_fora" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estatisticas_partidas" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "partida_id" INTEGER NOT NULL,
    "minutos_jogados" INTEGER NOT NULL DEFAULT 0,
    "gols" INTEGER NOT NULL DEFAULT 0,
    "assistencias" INTEGER NOT NULL DEFAULT 0,
    "passes_totais" INTEGER NOT NULL DEFAULT 0,
    "passes_certos" INTEGER NOT NULL DEFAULT 0,
    "passes_errados" INTEGER NOT NULL DEFAULT 0,
    "finalizacoes" INTEGER NOT NULL DEFAULT 0,
    "finalizacoes_alvo" INTEGER NOT NULL DEFAULT 0,
    "desarmes" INTEGER NOT NULL DEFAULT 0,
    "faltas_cometidas" INTEGER NOT NULL DEFAULT 0,
    "cartoes_amarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoes_vermelhos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estatisticas_partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_clubes" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "clube_id" INTEGER NOT NULL,
    "data_entrada" INTEGER NOT NULL,
    "data_saida" INTEGER,
    "jogos" INTEGER NOT NULL DEFAULT 0,
    "categoria" TEXT NOT NULL DEFAULT 'Profissional',

    CONSTRAINT "historico_clubes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_lesoes" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "tipo_lesao" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_retorno" TIMESTAMP(3),
    "descricao" TEXT,

    CONSTRAINT "historico_lesoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoTitulo" NOT NULL,

    CONSTRAINT "titulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogadores_titulos" (
    "id" SERIAL NOT NULL,
    "jogador_id" INTEGER NOT NULL,
    "titulo_id" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "clube_id" INTEGER NOT NULL,

    CONSTRAINT "jogadores_titulos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "logos_clubes_url_logo_key" ON "logos_clubes"("url_logo");

-- CreateIndex
CREATE UNIQUE INDEX "jogadores_titulos_jogador_id_titulo_id_key" ON "jogadores_titulos"("jogador_id", "titulo_id");

-- AddForeignKey
ALTER TABLE "paises" ADD CONSTRAINT "paises_bandeira_id_fkey" FOREIGN KEY ("bandeira_id") REFERENCES "bandeiras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados" ADD CONSTRAINT "estados_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "paises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubes" ADD CONSTRAINT "clubes_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos_clubes" ADD CONSTRAINT "logos_clubes_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "paises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_cidade_id_fkey" FOREIGN KEY ("cidade_id") REFERENCES "cidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_nivel_ambidestria_id_fkey" FOREIGN KEY ("nivel_ambidestria_id") REFERENCES "niveis_ambidestria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_posicao_id_fkey" FOREIGN KEY ("posicao_id") REFERENCES "posicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_posicao_secundaria_id_fkey" FOREIGN KEY ("posicao_secundaria_id") REFERENCES "posicoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_clube_atual_id_fkey" FOREIGN KEY ("clube_atual_id") REFERENCES "clubes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas" ADD CONSTRAINT "caracteristicas_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatisticas_gerais" ADD CONSTRAINT "estatisticas_gerais_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_clube_casa_id_fkey" FOREIGN KEY ("clube_casa_id") REFERENCES "clubes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_clube_fora_id_fkey" FOREIGN KEY ("clube_fora_id") REFERENCES "clubes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatisticas_partidas" ADD CONSTRAINT "estatisticas_partidas_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estatisticas_partidas" ADD CONSTRAINT "estatisticas_partidas_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_clubes" ADD CONSTRAINT "historico_clubes_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_clubes" ADD CONSTRAINT "historico_clubes_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_lesoes" ADD CONSTRAINT "historico_lesoes_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores_titulos" ADD CONSTRAINT "jogadores_titulos_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores_titulos" ADD CONSTRAINT "jogadores_titulos_titulo_id_fkey" FOREIGN KEY ("titulo_id") REFERENCES "titulos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores_titulos" ADD CONSTRAINT "jogadores_titulos_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
