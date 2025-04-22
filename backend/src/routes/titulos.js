import { Router } from "express";
import { inserirTitulo, pegarTitulos, editarTitulo, deletarTitulo, pegarTitulo } from "../controllers/titulosController.js";

const router = Router();

router.post("/inserirTitulo", inserirTitulo);
router.get("/pegarTitulos", pegarTitulos);
router.get("/pegarTitulo/:id", pegarTitulo);
router.put("/editarTitulo/:id", editarTitulo);
router.delete("/deletarTitulo/:id", deletarTitulo);

export default router;
