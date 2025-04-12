import { Router } from "express";
import { inserirClube, pegarClubes } from "../controllers/clubesController.js";

const router = Router();

router.post("/inserirClube", inserirClube);
router.get("/pegarClubes", pegarClubes);

export default router;
