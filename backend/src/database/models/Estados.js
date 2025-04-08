import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Estados = sequelize.define("Estados", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uf: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        validate: {
            isUppercase: true,
            len: [2, 2],
        },
    },
    pais_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "paises",
            key: "id",
        },
    },
}, {
    tableName: "estados",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Estados;
