import { Router } from "express";
import { CryptoController } from "../controllers/cryptoController";

const router = Router();
const controller = new CryptoController();

router.get("/", controller.getCryptoData);
router.get("/:code", controller.getCryptoDataByCode);

export default router;
