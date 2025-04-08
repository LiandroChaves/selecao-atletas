import express from "express";
import { pegarNiveis, inserirNivel } from "../controllers/ambidestriaController.js";

const router = express.Router();

router.get("/pegarNiveis", pegarNiveis);
router.post("/inserirNivel", inserirNivel);

export default router;
