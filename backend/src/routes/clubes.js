// File: backend/src/routes/clubes.js

import { Router } from "express";
import { inserirClube, pegarClubes, editarClube, deletarClube, pegarClubeAtualPorId, pegarClube, pegarClubesComLogo } from "../controllers/clubesController.js";

const router = Router();

router.post("/inserirClube", inserirClube);
router.get("/pegarClubes", pegarClubes);
router.get("/pegarClube/:id", pegarClube);
router.put("/editarClube/:id", editarClube);
router.delete("/deletarClube/:id", deletarClube);
router.get("/pegarClube_atuals/:id", pegarClubeAtualPorId);
router.get("/pegarClubesComLogo", pegarClubesComLogo);

export default router;
