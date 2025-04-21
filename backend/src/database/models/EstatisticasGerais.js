import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Jogador from "./Jogadores.js";

const EstatisticaGeral = sequelize.define("EstatisticaGeral", {
    jogador_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    partidas_jogadas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    gols: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    assistencias: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    titulos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    faltas_cometidas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    cartoes_amarelos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    cartoes_vermelhos: {
        type: DataTypes.INTEGER,
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
    tableName: "estatisticas_gerais",
    timestamps: false,
});


EstatisticaGeral.belongsTo(Jogador, {
    foreignKey: "jogador_id",
    onDelete: "CASCADE",
    as: 'jogadores',
});

export default EstatisticaGeral;
