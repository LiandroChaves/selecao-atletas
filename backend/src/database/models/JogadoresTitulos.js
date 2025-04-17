import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Jogador from "./Jogadores.js";
import Titulos from "./Titulos.js";
import Clubes from "./Clubes.js";

const JogadoresTitulos = sequelize.define("JogadoresTitulos", {
    jogador_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    titulo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    ano: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    clube_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: "jogadores_titulos",
    timestamps: false,
});

JogadoresTitulos.belongsTo(Jogador, { foreignKey: "jogador_id", as: "jogador" });
JogadoresTitulos.belongsTo(Titulos, { foreignKey: "titulo_id", as: "titulo" });
JogadoresTitulos.belongsTo(Clubes, { foreignKey: "clube_id", as: "clube" });

export default JogadoresTitulos;
