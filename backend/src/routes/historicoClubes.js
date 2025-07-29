    import { Router } from "express";
    import { inserirHistorico, pegarHistorico, deletarHistorico, editarHistorico } from "../controllers/historicoClubesController.js";

    const router = Router();

    router.post("/inserirHistorico", inserirHistorico);
    router.get("/pegarHistorico", pegarHistorico);
    router.get("/pegarHistoricoClubes",pegarHistorico);
    router.delete("/deletarHistoricoClube/:id",deletarHistorico);
    router.put("/editarHistoricoClube/:id",editarHistorico);

    // router.put("/")

    export default router;
