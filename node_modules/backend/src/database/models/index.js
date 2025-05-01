import sequelize from "../db.js";
import Pais from "../models/Pais.js";
import NivelAmbidestria from "../models/Ambidestria.js";
import Usuarios from "../models/Login.js";
import Cidades from "../models/Cidades.js";
import Estados from "../models/Estados.js";
import Posicoes from "../models/Posicoes.js";
import Clubes from "../models/Clubes.js";
import Jogadores from "../models/Jogadores.js";
import EstatisticaGeral from "../models/EstatisticasGerais.js";
import Partidas from "../models/Partidas.js";
import HistoricoClubes from "./HistoricoClubes.js";
import Jogador from "../models/Jogadores.js";
import Caracteristicas from "./Caracteristicas.js";
import EstatisticasPartidas from "./EstatisticasPartidas.js";
import Titulos from "./Titulos.js";
import HistoricoLesoes from "./HistoricoLesoes.js";
import JogadoresTitulos from "./JogadoresTitulos.js";
import CaracteristicasJogador from "./Caracteristicas.js";

Jogador.hasMany(HistoricoClubes, { as: "historico", foreignKey: "jogador_id" });
CaracteristicasJogador.belongsTo(Jogador, { as: "jogador", foreignKey: "jogador_id" });
Jogador.hasMany(CaracteristicasJogador, { as: "descricoes", foreignKey: "jogador_id" });
HistoricoClubes.belongsTo(Jogador, { as: "jogador", foreignKey: "jogador_id" });

const models = {
    Pais,
    NivelAmbidestria,
    Usuarios,
    Cidades,
    Estados,
    Posicoes,
    Clubes,
    Jogadores,
    EstatisticaGeral,
    Partidas,
    Jogador,
    Caracteristicas,
    HistoricoClubes,
    EstatisticasPartidas,
    Titulos,
    HistoricoLesoes,
    JogadoresTitulos
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;
