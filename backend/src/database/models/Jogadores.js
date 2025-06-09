// backend/src/database/models/jogador.model.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Posicao from "./Posicoes.js";
import Paises from "./Pais.js";
import Estado from "./Estados.js";
import Cidade from "./Cidades.js";
import Clubes from "./Clubes.js";
import NivelAmbidestria from "./Ambidestria.js";
import Caracteristicas from "./Caracteristicas.js";

const Jogador = sequelize.define("jogadores", {
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
    nome_curto: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    apelido: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    pais_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
            model: "paises",
            key: "id",
        },
    },
    estado_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
            model: "estados",
            key: "id",
        },
    },
    cidade_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
            model: "cidades",
            key: "id",
        },
    },
    altura: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
    peso: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    pe_dominante: {
        type: DataTypes.ENUM("D", "E", "A"),
        allowNull: false,
    },
    nivel_ambidestria_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
            model: "niveis_ambidestria",
            key: "id",
        },
    },
    posicao_id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        references: {
            model: "posicoes",
            key: "id",
        },
    },
    posicao_secundaria_id: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        references: {
            model: "posicoes",
            key: "id",
        },
    },
    clube_atual_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "clubes",
            key: "id",
        },
    },
    contrato_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    contrato_fim: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "jogadores",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

Jogador.belongsTo(Posicao, { as: 'posicao', foreignKey: 'posicao_id' });
Jogador.belongsTo(Paises, { as: 'pais', foreignKey: 'pais_id' });
Jogador.belongsTo(Estado, { as: 'estado', foreignKey: 'estado_id' });
Jogador.belongsTo(Cidade, { as: 'cidade', foreignKey: 'cidade_id' });
Jogador.belongsTo(Clubes, { as: 'clube', foreignKey: 'clube_atual_id' });
Jogador.belongsTo(NivelAmbidestria, { as: 'nivel_ambidestria', foreignKey: 'nivel_ambidestria_id' });
Jogador.belongsTo(Posicao, { as: 'posicao_secundaria', foreignKey: 'posicao_secundaria_id' });

Jogador.hasMany(Caracteristicas, { as: "caracteristicas", foreignKey: "jogador_id" });


export default Jogador;
