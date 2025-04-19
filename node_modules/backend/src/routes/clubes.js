import { Router } from "express";
import { inserirClube, pegarClubes, editarClube, deletarClube, pegarClubeAtualPorId } from "../controllers/clubesController.js";

const router = Router();

router.post("/inserirClube", inserirClube);
router.get("/pegarClubes", pegarClubes);
router.put("/editarClube/:id", editarClube);
router.delete("/deletarClube/:id", deletarClube);
router.get("/pegarClube_atuals/:id", pegarClubeAtualPorId); // Rota para pegar o clube atual por ID

export default router;
