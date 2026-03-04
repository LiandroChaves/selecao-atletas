import 'dotenv/config';
import { prisma } from '../config/database';

const newPosicoes = [
    { id: 1, nome: 'Goleiro' },
    { id: 2, nome: 'Zagueiro Central' },
    { id: 3, nome: 'Zagueiro Esquerdo' },
    { id: 4, nome: 'Zagueiro Direito' },
    { id: 5, nome: 'Zagueiro Esquerdo e Direito' },
    { id: 6, nome: 'Lateral Esquerdo' },
    { id: 7, nome: 'Lateral Direito' },
    { id: 8, nome: 'Lateral Esquerdo e Direito' },
    { id: 9, nome: 'Primeiro Volante' },
    { id: 10, nome: 'Segundo Volante' },
    { id: 11, nome: 'Atacante Esquerdo' },
    { id: 12, nome: 'Atacante Direito' },
    { id: 13, nome: 'Atacante Esquerdo e Direito' },
    { id: 14, nome: 'Meia Central' },
    { id: 15, nome: 'Meia Esquerdo' },
    { id: 16, nome: 'Meia Direito' },
    { id: 17, nome: 'Meia Esquerdo e Direito' },
    { id: 18, nome: 'Falso Nove' },
    { id: 19, nome: 'Centro Avante' },
    { id: 20, nome: 'Ponta Esquerda' },
    { id: 21, nome: 'Ponta Direita' },
    { id: 22, nome: 'Ponta Direita e Esquerda' },
];

async function main() {
    console.log('🚀 Iniciando migração de posições...');

    try {
        // 3. Limpar tabela de posições
        await prisma.posicao.deleteMany();
        console.log('🗑️ Tabela posicoes limpa.');

        // 4. Inserir novas posições com IDs fixos
        for (const pos of newPosicoes) {
            await prisma.posicao.create({
                data: pos
            });
        }
        console.log('✅ Novas posições inseridas (1-22).');

        // 6. Resetar sequence da tabela (PostgreSQL)
        await prisma.$executeRawUnsafe('SELECT setval(\'posicoes_id_seq\', 22);');
        console.log('🔄 Sequence de IDs resetada para 22.');

    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
    }

    console.log('🏁 Migração concluída!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
