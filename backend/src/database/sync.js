import sequelize from './db.js';
import Clubes from './models/Clubes.js';
import models from './models/index.js';
import Jogador from './models/Jogadores.js';
import Partidas from './models/Partidas.js';
import EstatisticaGeral from './models/EstatisticasGerais.js';
import EstatisticasPartidas from './models/EstatisticasPartidas.js';
import HistoricoClubes from './models/HistoricoClubes.js';
import HistoricoLesoes from './models/HistoricoLesoes.js';
import Titulos from './models/Titulos.js';
import JogadoresTitulos from './models/JogadoresTitulos.js';
import dayjs from 'dayjs';

const {
    Pais,
    Estados,
    Cidades,
    NivelAmbidestria,
    Usuarios,
    Posicoes,
    // Partidas,
} = models;

const seedData = async () => {
    const eu = { email: "LChaveszzz", senha: "$2b$06$TVaT15su2m0no0Lo49hwleZunhF1gR.Vf7keWtl6AFEbhkL7vGkOa" }

    await Usuarios.bulkCreate([
        { email: eu.email, senha: eu.senha }
    ]);

    const brasil = await Pais.create({ nome: 'Brasil' });

    const estadosPadrao = [
        { nome: 'Acre', uf: 'AC' },
        { nome: 'Alagoas', uf: 'AL' },
        { nome: 'Amapá', uf: 'AP' },
        { nome: 'Amazonas', uf: 'AM' },
        { nome: 'Bahia', uf: 'BA' },
        { nome: 'Ceará', uf: 'CE' },
        { nome: 'Distrito Federal', uf: 'DF' },
        { nome: 'Espírito Santo', uf: 'ES' },
        { nome: 'Goiás', uf: 'GO' },
        { nome: 'Maranhão', uf: 'MA' },
        { nome: 'Mato Grosso', uf: 'MT' },
        { nome: 'Mato Grosso do Sul', uf: 'MS' },
        { nome: 'Minas Gerais', uf: 'MG' },
        { nome: 'Pará', uf: 'PA' },
        { nome: 'Paraíba', uf: 'PB' },
        { nome: 'Paraná', uf: 'PR' },
        { nome: 'Pernambuco', uf: 'PE' },
        { nome: 'Piauí', uf: 'PI' },
        { nome: 'Rio de Janeiro', uf: 'RJ' },
        { nome: 'Rio Grande do Norte', uf: 'RN' },
        { nome: 'Rio Grande do Sul', uf: 'RS' },
        { nome: 'Rondônia', uf: 'RO' },
        { nome: 'Roraima', uf: 'RR' },
        { nome: 'Santa Catarina', uf: 'SC' },
        { nome: 'São Paulo', uf: 'SP' },
        { nome: 'Sergipe', uf: 'SE' },
        { nome: 'Tocantins', uf: 'TO' },
    ];

    await Estados.bulkCreate(
        estadosPadrao.map(({ nome, uf }) => ({
            nome,
            uf,
            pais_id: brasil.id
        }))
    );

    const estadosCadastrados = await Estados.findAll({ where: { uf: ['SP', 'RJ', 'CE'] } });

    const sp = estadosCadastrados.find(e => e.uf === 'SP');
    const rj = estadosCadastrados.find(e => e.uf === 'RJ');
    const ce = estadosCadastrados.find(e => e.uf === 'CE');


    await Cidades.bulkCreate([
        { nome: 'Limoeiro do Norte', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'Tabuleiro do Norte', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'Morada Nova', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'Russas', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'Flores', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'Iracema', pais_id: brasil.id, estado_id: ce.id },
        { nome: 'São Paulo', pais_id: brasil.id, estado_id: sp.id },
        { nome: 'Rio de Janeiro', pais_id: brasil.id, estado_id: rj.id },
        { nome: 'Campinas', pais_id: brasil.id, estado_id: sp.id },
    ]);

    await NivelAmbidestria.bulkCreate([
        { descricao: 'Excelente' },
        { descricao: 'Bom' },
        { descricao: 'Regular' },
        { descricao: 'Ruim' },
    ]);


    await Posicoes.bulkCreate([
        { nome: 'Goleiro' },
        { nome: 'Zagueiro' },
        { nome: 'Lateral Direito' },
        { nome: 'Lateral Esquerdo' },
        { nome: 'Volante' },
        { nome: 'Meia' },
        { nome: 'Atacante' },
        { nome: 'Extremo direito' },
        { nome: 'Extremo esquerdo' },
    ]);

    await Clubes.bulkCreate([
        { nome: 'Fortaleza', cidade_id: 1, pais_id: brasil.id },
        { nome: 'Ceará', cidade_id: 1, pais_id: brasil.id },
        { nome: 'São Paulo', cidade_id: 7, pais_id: brasil.id },
        { nome: 'Flamengo', cidade_id: 2, pais_id: brasil.id },
        { nome: 'Corinthians', cidade_id: 7, pais_id: brasil.id },
        { nome: 'Vasco', cidade_id: 2, pais_id: brasil.id },
    ]);

    await Partidas.bulkCreate([
        {
            data: "2025-04-10",
            campeonato: 'Jecep',
            estadio: 'Ginásio de Tabuleiro do Norte',
            clube_casa_id: 1,
            clube_fora_id: 2,
            gols_casa: 25,
            gols_fora: 34,
        },
    ])

    await Jogador.bulkCreate([
        {
            nome: 'Liandro da Silva Chaves',
            apelido: 'LChaves',
            data_nascimento: dayjs('2004-06-10').format('YYYY-MM-DD'),
            pais_id: brasil.id,
            estado_id: estadosCadastrados.find(e => e.uf === 'CE').id,
            cidade_id: 1,
            altura: 1.80,
            peso: 75.0,
            pe_dominante: 'D',
            nivel_ambidestria_id: 1,
            posicao_id: 1,
            posicao_secundaria_id: 2,
            clube_atual_id: 1,
            contrato_inicio: dayjs('2025-01-01').format('YYYY-MM-DD'),
            contrato_fim: dayjs('2025-12-31').format('YYYY-MM-DD'),
        }]);

    await EstatisticaGeral.bulkCreate([
        {
            jogador_id: 1,
            partidas_jogadas: 2,
            gols: 1,
            assistencias: 0,
            titulos: 3,
            faltas_cometidas: 1,
            cartoes_amarelos: 1,
            cartoes_vermelhos: 0,
        }]);

    await EstatisticasPartidas.bulkCreate([
        {
            jogador_id: 1,
            partida_id: 1,
            minutos_jogados: 90,
            gols: 1,
            assistencias: 0,
            passes_certos: 20,
            finalizacoes: 5,
            finalizacoes_no_alvo: 3,
            desarmes: 2,
            faltas_cometidas: 1,
            cartoes_amarelos: 0,
            cartoes_vermelhos: 0,
        },
    ]);

    await HistoricoClubes.bulkCreate([
        {
            jogador_id: 1,
            clube_id: 1,
            data_entrada: dayjs('2025-01-01').format('YYYY-MM-DD'),
            data_saida: dayjs('2025-12-31').format('YYYY-MM-DD'),
        },
    ]);

    await HistoricoLesoes.bulkCreate([
        {
            jogador_id: 1,
            tipo_lesao: 'Lesão no joelho',
            data_inicio: dayjs('2025-01-01').format('YYYY-MM-DD'),
            data_retorno: dayjs('2025-02-01').format('YYYY-MM-DD'),
            descricao: 'Lesão leve no joelho direito.',
        },
    ]);

    await Titulos.bulkCreate([
        {
            jogador_id: 1,
            nome: 'Campeão Cearense',
            tipo: 'Nacional',
            data_conquista: dayjs('2025-12-31').format('YYYY-MM-DD'),
        }])

    await JogadoresTitulos.bulkCreate([
        {
            jogador_id: 1,
            titulo_id: 1,
            ano: 2025,
            clube_id: 1,
        },
    ]);
};

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('📦 Banco sincronizado com sucesso!');

        await seedData();
        console.log('🌱 Dados padrão inseridos com sucesso!');
    } catch (err) {
        console.error('❌ Erro ao sincronizar o banco:', err);
    } finally {
        await sequelize.close();
        console.log('🔒 Conexão encerrada.');
    }
};

syncDatabase();
