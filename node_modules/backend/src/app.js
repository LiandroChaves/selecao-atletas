import { verificarLicenca } from './middleware/verificarLicenca.js';
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
import uploadLogoClubes from "./routes/uploadLogoClubes.js";
import estatisticaGeralRoutes from "./routes/estatisticasGerais.js";
import partidasRoutes from "./routes/partidas.js";
import estatisticasPartidasRoutes from "./routes/estatisticasPartidas.js";
import historicoClubesRoutes from "./routes/historicoClubes.js";
import historicoLesoesRoutes from "./routes/historicoLesoes.js";
import titulosRoutes from "./routes/titulos.js";
import jogadoresTitulosRoutes from "./routes/jogadoresTitulos.js";
import caracteristicasJogadoresRoutes from "./routes/caracteristica.js";
import pdfRoute from "./routes/pdf.js"
import databaseRoutes from "./routes/database.js";
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Função para pegar o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

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

// verificação temporária
app.use(verificarLicenca);

// Rotas
app.use("/api/paises", paisesRoutes); // Rota de países
app.use("/api/ambidestria", ambidestriaRoutes); // Rota de ambidestria
app.use("/api/estados", estadosRoutes); // Rota de estados
app.use("/api/cidades", cidadesRoutes); // Rota de cidades
app.use("/api/posicoes", posicoesRoutes); // Rota de posições
app.use("/api/login", loginRoutes); // Rota de login
app.use("/api/usuarios", usuariosRoutes); // Rota de usuários
app.use("/api/clubes", clubesRoutes); // Rota de clubes
app.use("/api/clubes", clubesRoutes); // Rota de clubes fora e casa
app.use("/api/jogadores", jogadoresRoutes); // Rota de jogadores
app.use("/api/estatisticas", estatisticaGeralRoutes); // Rota de estatísticas gerais
app.use("/api/partidas", partidasRoutes); // Rota de partidas
app.use("/api/estatisticas-partidas", estatisticasPartidasRoutes); // Rota de estatísticas de partidas
app.use("/api/historico-clubes", historicoClubesRoutes); // Rota de histórico de clubes
app.use("/api/historico-lesoes", historicoLesoesRoutes); // Rota de histórico de lesões
app.use("/api/titulos", titulosRoutes); // Rota de títulos
app.use("/api/jogadores-titulos", jogadoresTitulosRoutes); // Rota de jogadores e títulos
app.use("/api/posicao_secundarias", posicoesRoutes);
app.use("/api/clube_atuals", clubesRoutes); // Rota de clubes atuais
app.use("/api/nivel_ambidestrias", ambidestriaRoutes); // Rota de níveis de ambidestria
app.use("/api/caracteristica-jogadores", caracteristicasJogadoresRoutes); // Rota de descricao de jogadores

app.use('/api/uploads', express.static(uploadsPath)); // Serve arquivos estáticos da pasta uploads
app.use("/api/uploads", uploadRouter); // Rota para upload de arquivos
app.use("/api/logos-clubes", uploadLogoClubes); // Rota para upload de logos de clubes
app.use("/api/pdf", pdfRoute);
app.use("/api/database", databaseRoutes);


// Rota padrão
app.get("/", (req, res) => {
    res.send("API está rodando! 🚀");
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em:`);
    console.log(`- Localhost: http://localhost:${PORT}`);
    console.log(`- Network:   http://${localIP}:${PORT}`);
});


// http://localhost:3001   // Rota padrão