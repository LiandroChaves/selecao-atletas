// backend/src/database/models/Caracteristicas.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Caracteristicas = sequelize.define("caracteristicas", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: "caracteristicas",
    timestamps: false, // Caso não precise de timestamps, senão pode remover isso
});

export default Caracteristicas;
