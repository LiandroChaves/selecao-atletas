import express from "express";
import { contarTabelasBanco } from "../controllers/databaseController.js";

const router = express.Router();

router.get("/contagem", contarTabelasBanco);

export default router;
