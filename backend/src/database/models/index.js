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

import { DataTypes } from "sequelize";
// ...

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
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;
