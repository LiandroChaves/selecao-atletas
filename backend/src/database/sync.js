import sequelize from "./db.js";
import "../models/index.js"; // importa todos os modelos (assume que o index.js importa tudo)

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // alter:true mantém os dados e atualiza colunas
    console.log("✅ Banco de dados sincronizado com sucesso.");
  } catch (error) {
    console.error("❌ Falha ao sincronizar o banco de dados:", error);
  }
};

syncDatabase();
