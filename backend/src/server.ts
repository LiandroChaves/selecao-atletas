
import 'dotenv/config';
console.log('🔍 URL DO BANCO:', process.env.DATABASE_URL);
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';
import { localidadeRoutes } from './routes/localidade.routes';
import { clubeRoutes } from './routes/clube.routes';
import { jogadorRoutes } from './routes/jogador.routes';
import { configuracaoRoutes } from './routes/configuracao.routes';
import { partidaRoutes } from './routes/partida.routes';
import { historicoRoutes } from './routes/historico.routes';
import { tituloRoutes } from './routes/titulo.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/localidades', localidadeRoutes);
app.use('/clubes', clubeRoutes);
app.use('/jogadores', jogadorRoutes);
app.use('/configuracoes', configuracaoRoutes);
app.use('/partidas', partidaRoutes);
app.use('/historicos', historicoRoutes);
app.use('/titulos', tituloRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
});