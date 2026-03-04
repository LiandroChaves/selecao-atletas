-- Fix schema drift in estatisticas_gerais table
-- The table was modified directly in schema.prisma without a proper migration.

-- Step 1: Drop the old primary key constraint (jogador_id was the PK)
ALTER TABLE "estatisticas_gerais" DROP CONSTRAINT IF EXISTS "estatisticas_gerais_pkey";

-- Step 2: Add the new columns
ALTER TABLE "estatisticas_gerais" ADD COLUMN IF NOT EXISTS "id" SERIAL NOT NULL;
ALTER TABLE "estatisticas_gerais" ADD COLUMN IF NOT EXISTS "temporada" TEXT NOT NULL DEFAULT 'Geral';
ALTER TABLE "estatisticas_gerais" ADD COLUMN IF NOT EXISTS "clube_id" INTEGER;

-- Step 3: Drop the old 'titulos' column that no longer exists in the schema
ALTER TABLE "estatisticas_gerais" DROP COLUMN IF EXISTS "titulos";

-- Step 4: Set the new primary key
ALTER TABLE "estatisticas_gerais" ADD CONSTRAINT "estatisticas_gerais_pkey" PRIMARY KEY ("id");

-- Step 5: Add the foreign key for clube_id
ALTER TABLE "estatisticas_gerais" ADD CONSTRAINT "estatisticas_gerais_clube_id_fkey" FOREIGN KEY ("clube_id") REFERENCES "clubes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
