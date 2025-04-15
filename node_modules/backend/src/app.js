import express from "express";
import cors from "cors";
import testConnection from "./database/seq.js";
import models from "./database/models/index.js";
import paisesRoutes from "./routes/paises.js";
import ambidestriaRoutes from "./routes/ambidestria.js";
import estadosRoutes from "./routes/estados.js";
import cidadesRoutes from "./routes/cidades.js";
import posicoesRoutes from "./routes/posicoes.js";
import loginRoutes from "./routes/login.js";
import usuariosRoutes from "./routes/usuarios.js";
import clubesRoutes from "./routes/clubes.js";
import jogadoresRoutes from "./routes/jogadores.js";
import uploadRouter from './routes/upload.js';
import estatisticaGeralRoutes from "./routes/estatisticasGerais.js";
import partidasRoutes from "./routes/partidas.js";


import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');

// Testa conexão com o banco
testConnection();

// Rotas
app.use("/api/paises", paisesRoutes); // Rota de países
app.use("/api/ambidestria", ambidestriaRoutes); // Rota de ambidestria
app.use("/api/estados", estadosRoutes); // Rota de estados
app.use("/api/cidades", cidadesRoutes); // Rota de cidades
app.use("/api/posicoes", posicoesRoutes); // Rota de posições
app.use("/api/login", loginRoutes); // Rota de login
app.use("/api/usuarios", usuariosRoutes); // Rota de usuários
app.use("/api/clubes", clubesRoutes); // Rota de clubes
app.use("/api/jogadores", jogadoresRoutes); // Rota de jogadores
app.use("/api/estatisticas", estatisticaGeralRoutes); // Rota de estatísticas gerais
app.use("/api/partidas", partidasRoutes); // Rota de partidas

app.use('/api/uploads', express.static(uploadsPath)); // Serve arquivos estáticos da pasta uploads
app.use("/api/uploads", uploadRouter); // Rota para upload de arquivos

// Rota padrão
app.get("/", (req, res) => {
    res.send("API está rodando! 🚀");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});

// http://localhost:3001/api/   // Rota padrão