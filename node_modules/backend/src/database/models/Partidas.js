import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Clubes from "./Clubes.js";

const Partidas = sequelize.define("Partida", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    campeonato: {
        type: DataTypes.STRING,
    },
    estadio: {
        type: DataTypes.STRING,
    },
    clube_casa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clube_fora_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gols_casa: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    gols_fora: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "partidas",
    timestamps: false,
});

// Associações
Partidas.belongsTo(Clubes, { foreignKey: "clube_casa_id", as: "clubeCasa" });
Partidas.belongsTo(Clubes, { foreignKey: "clube_fora_id", as: "clubeFora" });

export default Partidas;
