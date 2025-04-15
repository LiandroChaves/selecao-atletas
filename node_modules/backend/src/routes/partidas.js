import express from "express";
import { pegarPartidas, inserirPartida } from "../controllers/partidasController.js";

const router = express.Router();

router.get("/pegarPartidas", pegarPartidas);
router.post("/inserirPartida", inserirPartida);

export default router;