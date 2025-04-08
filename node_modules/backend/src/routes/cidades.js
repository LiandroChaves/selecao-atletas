import express from "express";
import { inserirCidades, pegarCidades } from "../controllers/cidadeController.js";

const router = express.Router();

router.post("/inserirCidade", inserirCidades);
router.get("/pegarCidades", pegarCidades);

export default router;
