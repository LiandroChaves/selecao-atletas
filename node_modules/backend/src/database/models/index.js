import sequelize from "../db.js";
import Pais from "../models/Pais.js";

// ...

const models = {
    Pais,
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;
