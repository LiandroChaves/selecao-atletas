import express from "express";
import cors from "cors";
import testConnection from "./database/seq.js";
import models from "./database/models/index.js";
import paisesRoutes from "./routes/paises.js";
import ambidestriaRoutes from "./routes/ambidestria.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testa conexão com o banco
testConnection();

// Rotas
app.use("/api/paises", paisesRoutes); // Rota de países
app.use("/api/ambidestria", ambidestriaRoutes); // Rota de ambidestria

// Rota padrão
app.get("/", (req, res) => {
    res.send("API está rodando! 🚀");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
