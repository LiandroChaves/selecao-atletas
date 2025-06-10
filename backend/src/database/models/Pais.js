import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Pais = sequelize.define("Pais", {
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
    bandeira_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
            model: "bandeiras",
            key: "id",
        },
    },
}, {
    tableName: "paises",
    timestamps: false,
});


export default Pais;
