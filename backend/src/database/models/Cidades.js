import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Cidades = sequelize.define("Cidades", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    pais_id: {
        type: DataTypes.SMALLINT,
        references: {
            model: "paises",
            key: "id",
        },
    },
    estado_id: {
        type: DataTypes.SMALLINT,
        references: {
            model: "estados",
            key: "id",
        },
    },
}, {
    tableName: "cidades",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Cidades;
