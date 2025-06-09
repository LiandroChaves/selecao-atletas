// file: backend/src/database/models/Bandeiras.js

import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Bandeiras = sequelize.define("bandeiras", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    logo_bandeira: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "bandeiras",
    timestamps: false,
});

export default Bandeiras;