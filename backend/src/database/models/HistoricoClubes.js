import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Clubes from "./Clubes.js";
import Jogador from "./Jogadores.js";

const HistoricoClubes = sequelize.define("historico_clubes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jogador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clube_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_entrada: {
        type: DataTypes.DATEONLY,
    },
    data_saida: {
        type: DataTypes.DATEONLY,
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
    timestamps: false,
});

HistoricoClubes.belongsTo(Jogador, { foreignKey: "jogador_id", as: "jogador" });
HistoricoClubes.belongsTo(Clubes, { foreignKey: "clube_id", as: "clube" });


export default HistoricoClubes;
