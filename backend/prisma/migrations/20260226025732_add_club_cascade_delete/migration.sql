-- DropForeignKey
ALTER TABLE "historico_clubes" DROP CONSTRAINT "historico_clubes_clube_id_fkey";

-- DropForeignKey
ALTER TABLE "jogadores_titulos" DROP CONSTRAINT "jogadores_titulos_clube_id_fkey";

-- DropForeignKey
ALTER TABLE "partidas" DROP CONSTRAINT "partidas_clube_casa_id_fkey";

-- DropForeignKey
ALTER TABLE "partidas" DROP CONSTRAINT "partidas_clube_fora_id_fkey";

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_clube_casa_id_fkey" FOREIGN KEY ("clube_casa_id") REFERENCES "clubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_clube_fora_id_fkey" FOREIGN KEY ("clube_fora_id") REFERENCES "clubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_clubes" ADD CONSTRAINT "historico_clubes_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores_titulos" ADD CONSTRAINT "jogadores_titulos_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
