import express from "express";
import { inserirCidades, pegarCidades, pegarCidadePorId, editarCidades } from "../controllers/cidadeController.js";

const router = express.Router();

router.post("/inserirCidade", inserirCidades);
router.get("/pegarCidades", pegarCidades);
router.get("/pegarCidadePorId/:id", pegarCidadePorId);
router.put("/editarCidade/:id", editarCidades);

export default router;
