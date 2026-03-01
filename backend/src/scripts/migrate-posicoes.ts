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

    // 1. Mapear jogadores atuais e suas posições (pelo nome)
    const jogadoresAtuais = await prisma.jogador.findMany({
        include: { posicao_principal: true }
    });

    console.log(`📊 Encontrados ${jogadoresAtuais.length} jogadores para remapear.`);

    // 2. Desabilitar FKs temporariamente (PostgreSQL)
    await prisma.$executeRawUnsafe('SET session_replication_role = \'replica\';');

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

        // 5. Atualizar jogadores
        for (const jogador of jogadoresAtuais) {
            const nomeAntigo = jogador.posicao_principal.nome.toLowerCase();

            // Tenta encontrar o novo ID pelo nome (mesmo que parcial/aproximado)
            const novaPosicao = newPosicoes.find(p => p.nome.toLowerCase() === nomeAntigo)
                || newPosicoes.find(p => p.nome.toLowerCase().includes(nomeAntigo))
                || newPosicoes.find(p => nomeAntigo.includes(p.nome.toLowerCase()));

            if (novaPosicao) {
                await prisma.jogador.update({
                    where: { id: jogador.id },
                    data: { posicao_id: novaPosicao.id }
                });
                console.log(`👤 Jogador ${jogador.nome}: ${nomeAntigo} -> ${novaPosicao.nome} (ID ${novaPosicao.id})`);
            } else {
                // Fallback: Goleiro se não encontrar nada (ID 1)
                await prisma.jogador.update({
                    where: { id: jogador.id },
                    data: { posicao_id: 1 }
                });
                console.warn(`⚠️ Jogador ${jogador.nome}: Não foi possível mapear "${nomeAntigo}". Definido como Goleiro.`);
            }
        }

        // 6. Resetar sequence da tabela (PostgreSQL)
        await prisma.$executeRawUnsafe('SELECT setval(\'posicoes_id_seq\', 22);');
        console.log('🔄 Sequence de IDs resetada para 22.');

    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
    } finally {
        // 7. Reativar FKs
        await prisma.$executeRawUnsafe('SET session_replication_role = \'origin\';');
        console.log('🔗 Constraints de FK reativadas.');
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
