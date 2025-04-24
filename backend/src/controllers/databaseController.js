import db from "../database/models/index.js";

export const contarTabelasBanco = async (_req, res) => {
    try {
        const contagens = {
            usuarios: await db.Usuarios.count(),
            paises: await db.Pais.count(),
            estados: await db.Estados.count(),
            cidades: await db.Cidades.count(),
            niveis_ambidestria: await db.NivelAmbidestria.count(),
            posicoes: await db.Posicoes.count(),
            clubes: await db.Clubes.count(),
            jogadores: await db.Jogador.count(),
            caracteristicas: await db.Caracteristicas.count(),
            estatisticas_gerais: await db.EstatisticaGeral.count(),
            partidas: await db.Partidas.count(),
            estatisticas_partidas: await db.EstatisticasPartidas.count(),
            historico_clubes: await db.HistoricoClubes.count(),
            historico_lesoes: await db.HistoricoLesoes.count(),
            titulos: await db.Titulos.count(),
            jogadores_titulos: await db.JogadoresTitulos.count(),
        };

        res.json(contagens);
    } catch (error) {
        console.error("❌ Erro ao contar registros do banco:", error);
        res.status(500).json({ error: "Erro ao contar registros do banco." });
    }
};
