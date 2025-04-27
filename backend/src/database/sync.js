import sequelize from './db.js';
import models from './models/index.js';

const {
    Pais,
    Estados,
    Cidades,
    NivelAmbidestria,
    Posicoes,
} = models;

const seedData = async () => {

    const brasil = await Pais.create({ nome: 'Brasil' });

    const estadosPadrao = [
        { nome: 'Ceará', uf: 'CE' },
        { nome: 'Acre', uf: 'AC' },
        { nome: 'Alagoas', uf: 'AL' },
        { nome: 'Amapá', uf: 'AP' },
        { nome: 'Amazonas', uf: 'AM' },
        { nome: 'Bahia', uf: 'BA' },
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

    const ce = estadosCadastrados.find(e => e.uf === 'CE');

    const cidadesCeara = [
        // 🐆 Vale do Jaguaribe primeiro
        'Alto Santo',
        'Ererê',
        'Iracema',
        'Jaguaribe',
        'Jaguaruana',
        'Limoeiro do Norte',
        'Morada Nova',
        'Pereiro',
        'Potiretama',
        'Quixeré',
        'Russas',
        'São João do Jaguaribe',
        'Tabuleiro do Norte',

        // 🅰️ Depois o resto em ordem alfabética
        'Abaiara',
        'Acarape',
        'Acaraú',
        'Acopiara',
        'Aiuaba',
        'Alcântaras',
        'Altaneira',
        'Amontada',
        'Antonina do Norte',
        'Apuiarés',
        'Aquiraz',
        'Aracati',
        'Aracoiaba',
        'Ararendá',
        'Araripe',
        'Aratuba',
        'Arneiroz',
        'Assaré',
        'Aurora',
        'Baixio',
        'Banabuiú',
        'Barbalha',
        'Barreira',
        'Barro',
        'Barroquinha',
        'Baturité',
        'Beberibe',
        'Bela Cruz',
        'Boa Viagem',
        'Brejo Santo',
        'Camocim',
        'Campos Sales',
        'Canindé',
        'Capistrano',
        'Caridade',
        'Cariré',
        'Caririaçu',
        'Cariús',
        'Carnaubal',
        'Cascavel',
        'Catarina',
        'Catunda',
        'Caucaia',
        'Cedro',
        'Chaval',
        'Choró',
        'Chorozinho',
        'Coreaú',
        'Crateús',
        'Crato',
        'Croatá',
        'Cruz',
        'Deputado Irapuan Pinheiro',
        'Eusébio',
        'Farias Brito',
        'Forquilha',
        'Fortaleza',
        'Fortim',
        'Frecheirinha',
        'General Sampaio',
        'Graça',
        'Granja',
        'Granjeiro',
        'Groaíras',
        'Guaiúba',
        'Guaraciaba do Norte',
        'Guaramiranga',
        'Hidrolândia',
        'Horizonte',
        'Ibaretama',
        'Ibiapina',
        'Ibicuitinga',
        'Icapuí',
        'Icó',
        'Iguatu',
        'Independência',
        'Ipaporanga',
        'Ipaumirim',
        'Ipu',
        'Ipueiras',
        'Irauçuba',
        'Itaiçaba',
        'Itaitinga',
        'Itapagé',
        'Itapipoca',
        'Itapiúna',
        'Itarema',
        'Itatira',
        'Jaguaretama',
        'Jardim',
        'Jati',
        'Jijoca de Jericoacoara',
        'Juazeiro do Norte',
        'Jucás',
        'Lavras da Mangabeira',
        'Madalena',
        'Maracanaú',
        'Maranguape',
        'Marco',
        'Martinópole',
        'Massapê',
        'Mauriti',
        'Meruoca',
        'Milagres',
        'Milhã',
        'Miraíma',
        'Missão Velha',
        'Mombaça',
        'Monsenhor Tabosa',
        'Moraújo',
        'Morrinhos',
        'Mucambo',
        'Mulungu',
        'Nova Olinda',
        'Nova Russas',
        'Novo Oriente',
        'Ocara',
        'Orós',
        'Pacajus',
        'Pacatuba',
        'Pacoti',
        'Pacujá',
        'Palhano',
        'Palmácia',
        'Paracuru',
        'Paraipaba',
        'Parambu',
        'Paramoti',
        'Pedra Branca',
        'Penaforte',
        'Pentecoste',
        'Pindoretama',
        'Piquet Carneiro',
        'Pires Ferreira',
        'Poranga',
        'Porteiras',
        'Potengi',
        'Quiterianópolis',
        'Quixadá',
        'Quixelô',
        'Quixeramobim',
        'Redenção',
        'Reriutaba',
        'Saboeiro',
        'Salitre',
        'Santa Quitéria',
        'Santana do Acaraú',
        'Santana do Cariri',
        'São Benedito',
        'São Gonçalo do Amarante',
        'São Luís do Curu',
        'Senador Pompeu',
        'Senador Sá',
        'Sobral',
        'Solonópole',
        'Tamboril',
        'Tarrafas',
        'Tauá',
        'Tejuçuoca',
        'Tianguá',
        'Trairi',
        'Tururu',
        'Ubajara',
        'Umari',
        'Umirim',
        'Uruburetama',
        'Uruoca',
        'Varjota',
        'Várzea Alegre',
        'Viçosa do Ceará'
    ];

    const cidadesData = cidadesCeara.map(nome => ({
        nome,
        pais_id: brasil.id,
        estado_id: ce.id,
    }));

    await Cidades.bulkCreate(cidadesData);

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
