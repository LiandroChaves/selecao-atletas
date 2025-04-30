// models/EstatisticasPartidas.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Jogador from "./Jogadores.js";
import Partidas from "./Partidas.js";

const EstatisticasPartidas = sequelize.define("estatisticas_partidas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    jogador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partida_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minutos_jogados: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    gols: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    assistencias: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    passes_totais: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    passes_certos: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    passes_errados: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    finalizacoes: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    finalizacoes_no_alvo: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    desarmes: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    faltas_cometidas: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    cartoes_amarelos: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },
    cartoes_vermelhos: {
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
    tableName: "estatisticas_partidas",
    timestamps: false,
});

// Associações
EstatisticasPartidas.belongsTo(Jogador, { foreignKey: "jogador_id", as: "jogador", onDelete: "CASCADE" });
EstatisticasPartidas.belongsTo(Partidas, { foreignKey: "partida_id", as: "partida" });

export default EstatisticasPartidas;
