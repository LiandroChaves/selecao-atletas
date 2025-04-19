import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Jogador from "./Jogadores.js";

const HistoricoLesoes = sequelize.define("HistoricoLesoes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    jogador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_lesao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    data_retorno: {
        type: DataTypes.DATEONLY,
    },
    descricao: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "historico_lesoes",
    timestamps: false,
});

HistoricoLesoes.belongsTo(Jogador, { foreignKey: "jogador_id", as: "jogador", onDelete: "CASCADE" });

export default HistoricoLesoes;
