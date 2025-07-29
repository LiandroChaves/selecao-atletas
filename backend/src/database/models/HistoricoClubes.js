import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Clubes from "./Clubes.js";

const HistoricoClubes = sequelize.define("historico_clubes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jogador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "jogadores",
            key: "id",
        },
    },
    clube_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "clubes",
            key: "id",
        },
    },
    data_entrada: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_saida: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    jogos: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    categoria: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Profissional",
        validate: {
            isIn: [["Amador", "Profissional", "Base"]],
        },
    },
}, {
    timestamps: false,
});

HistoricoClubes.belongsTo(Clubes, { foreignKey: "clube_id", as: "clube" });

export default HistoricoClubes;
