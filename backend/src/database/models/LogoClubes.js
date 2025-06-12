import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const LogosClubes = sequelize.define("logos_clubes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    clube_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    url_logo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "logos_clubes",
    timestamps: true, // Vamos manter created_at e updated_at para as imagens também
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default LogosClubes;
