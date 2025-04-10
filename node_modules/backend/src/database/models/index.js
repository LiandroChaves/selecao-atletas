import sequelize from "../db.js";
import Pais from "../models/Pais.js";
import NivelAmbidestria from "../models/Ambidestria.js";
import Usuarios from "../models/Login.js";
import Cidades from "../models/Cidades.js";
import Estados from "../models/Estados.js";
import { DataTypes } from "sequelize";
// ...

const models = {
    Pais,
    NivelAmbidestria,
    Usuarios,
    Cidades,
    Estados,
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;
