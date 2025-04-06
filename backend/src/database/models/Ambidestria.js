import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const NivelAmbidestria = sequelize.define("niveis_ambidestria", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: "niveis_ambidestria",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default NivelAmbidestria;