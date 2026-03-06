
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function test() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('Testing prisma.jogador.update with multiple ID fields...');
    try {
        // Try to update with ID fields directly
        await prisma.jogador.update({
            where: { id: 1 },
            data: {
                nivel_ambidestria: { connect: { id: 1 } },
                posicao_principal: { connect: { id: 1 } },
                posicao_secundaria: { connect: { id: 2 } },
                clube_atual: { connect: { id: 1 } },
                pais: { connect: { id: 1 } },
                estado: { connect: { id: 1 } },
                cidade: { connect: { id: 1 } }
            }
        });
        console.log('Success with all fields!');
    } catch (error: any) {
        console.error('Error caught:');
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
