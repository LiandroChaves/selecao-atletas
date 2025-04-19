import express from "express";
import { pegarNiveis, inserirNivel, editarNivel, pegarNiveisPraPesquisa, deletarAmbidestria } from "../controllers/ambidestriaController.js";

const router = express.Router();

router.get("/pegarNiveis", pegarNiveis);
router.post("/inserirNivel", inserirNivel);
router.get("/pegarAmbidestria", pegarNiveisPraPesquisa); // Rota para pegar níveis de ambidestria para pesquisa
router.put("/editarAmbidestria/:id", editarNivel); // Rota para editar nível de ambidestria
router.delete("/deletarAmbidestria/:id", deletarAmbidestria); // Rota para deletar nível de ambidestria

export default router;
