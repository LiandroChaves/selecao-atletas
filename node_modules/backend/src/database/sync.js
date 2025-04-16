import sequelize from './db.js';
import Clubes from './models/Clubes.js';
import models from './models/index.js';
import Jogador from './models/Jogadores.js';
import dayjs from 'dayjs';

const {
    Pais,
    Estados,
    Cidades,
    NivelAmbidestria,
    Usuarios,
    Posicoes,
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

    // await Jogador.bulkCreate([{
    //     nome: 'Liandro da Silva Chaves',
    //     apelido: 'Chavinho',
    //     data_nascimento: dayjs('10/06/2004', 'DD/MM/YYYY').format('YYYY-MM-DD'),
    //     pais_id: brasil.id,
    //     naturalidade: 'Brasileiro',
    //     estado_id: ce.id,
    //     cidade_id: 1,
    //     altura: 1.75,
    //     peso: 82.66,
    //     pe_dominante: 'D',
    //     nivel_ambidestria_id: 4,
    //     posicao_id: 1,
    //     posicao_secundaria_id: 2,
    //     clube_atual_id: 1,
    //     contrato_inicio: dayjs('01/01/2023', 'DD/MM/YYYY').format('YYYY-MM-DD'),
    //     contrato_fim: dayjs('01/01/2025', 'DD/MM/YYYY').format('YYYY-MM-DD'),

    // }]);;
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
