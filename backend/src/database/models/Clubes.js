import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Paises from "./Pais.js";

const Clubes = sequelize.define("clubes", {
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
    pais_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    fundacao: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    estadio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    inicio_contrato: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    fim_contrato: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}, {
    tableName: "clubes",
    timestamps: false,
});

Clubes.belongsTo(Paises, { foreignKey: "pais_id", as: "pais" });

export default Clubes;