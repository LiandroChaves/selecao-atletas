import 'dotenv/config';
import { prisma } from '../config/database';

async function main() {
    console.log('🌱 Iniciando Seed completo (Localização, Clubes, Atleta e Partidas)...');

    // 1. Níveis de Ambidestria
    const niveis = [
        { id: 1, descricao: 'Nenhuma' },
        { id: 2, descricao: 'Média' },
        { id: 3, descricao: 'Alta (Ambidestro)' }
    ];

    for (const n of niveis) {
        await prisma.nivelAmbidestria.upsert({
            where: { id: n.id },
            update: {},
            create: n
        });
    }

    // 2. Localização
    const bandeiraBrasil = await prisma.bandeira.create({
        data: { nome: 'Brasil', logo_bandeira: 'paises/br.png' }
    });

    const brasil = await prisma.pais.create({
        data: { nome: 'Brasil', bandeira_id: bandeiraBrasil.id }
    });

    const ceara = await prisma.estado.create({
        data: { nome: 'Ceará', uf: 'CE', pais_id: brasil.id }
    });

    const limoeiro = await prisma.cidade.create({
        data: { nome: 'Limoeiro do Norte', pais_id: brasil.id, estado_id: ceara.id }
    });

    // 3. Clubes (ECL e um adversário)
    const ecl = await prisma.clube.create({
        data: {
            nome: 'Esporte Clube Limoeiro',
            pais_id: brasil.id,
            fundacao: 1942,
            estadio: 'Bandeirão',
            logos: { create: { url_logo: 'clubes/logo ECL.png' } }
        }
    });

    const cearaSC = await prisma.clube.create({
        data: {
            nome: 'Clube de Regatas do Flamengo',
            pais_id: brasil.id,
            fundacao: 1985,
            estadio: 'Maracanã',
            logos: { create: { url_logo: 'clubes/flamengo.png' } }
        }
    });

    // 4. Jogador Liandro Chaves
    const jogador = await prisma.jogador.create({
        data: {
            nome: 'Liandro Chaves',
            nome_curto: 'Chaves',
            apelido: 'Genos',
            data_nascimento: new Date('2004-06-10'),
            pe_dominante: 'D',
            nivel_ambidestria_id: 2,
            posicao_id: 9, // Primeiro Volante
            clube_atual_id: ecl.id,
            pais_id: brasil.id,
            estado_id: ceara.id,
            cidade_id: limoeiro.id,
            altura: 1.78,
            peso: 89.2,
            foto: 'temp/logo ECL.png', // Sua foto conforme solicitado
            whatsapp: '5588999999999',
            instagram: 'https://instagram.com/liandrochaves',
            twitter: 'https://x.com/liandro',
            facebook: 'https://facebook.com/liandro',
            tiktok: 'https://tiktok.com/@liandro',
            video: 'https://youtube.com/watch?v=scout-ecl',
            observacoes: 'Destaque do Esporte Clube Limoeiro, volante de contenção com passe qualificado.'
        }
    });

    // 5. Partida (ECL vs Ceará)
    const partida = await prisma.partida.create({
        data: {
            data: new Date(),
            campeonato: 'Campeonato Cearense',
            estadio: 'Bandeirão',
            clube_casa_id: ecl.id,
            clube_fora_id: cearaSC.id,
            gols_casa: 2,
            gols_fora: 1
        }
    });

    // 6. Estatísticas do Jogador na Partida
    await prisma.estatisticaPartida.create({
        data: {
            jogador_id: jogador.id,
            partida_id: partida.id,
            minutos_jogados: 90,
            gols: 0,
            assistencias: 1,
            passes_totais: 45,
            passes_certos: 40,
            passes_errados: 5,
            desarmes: 8,
            faltas_cometidas: 2,
            cartoes_amarelos: 1,
            cartoes_vermelhos: 0
        }
    });

    console.log('✅ Seed finalizado: Localização, Clubes, Atleta e Partida com Stats criados!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });