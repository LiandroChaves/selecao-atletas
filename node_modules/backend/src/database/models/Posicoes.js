import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Posicoes = sequelize.define("Posicoes", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "posicoes",
    timestamps: false,
});


export default Posicoes;
