import sequelize from "./db.js";

const testConnection = async () => {
    const now = new Date().toLocaleString(); // Data e hora local

    try {
        await sequelize.authenticate();
        console.log(`🟢 [${now}] Conexão com o banco de dados estabelecida com sucesso.`);
    } catch (error) {
        console.error(`🔴 [${now}] Erro ao conectar com o banco de dados:`, error);
    }
};

export default testConnection;
