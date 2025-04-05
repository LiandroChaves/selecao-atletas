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
}, {
    tableName: "paises",
    timestamps: false, // ou true se quiser usar createdAt/updatedAt automáticos
});


export default Pais;
