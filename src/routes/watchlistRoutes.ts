import { Router } from "express";
import { WatchlistController } from "../controllers/watchlistController";
import { validatorHandler } from "../middlewares/validatorHandler";
import { watchlistSchema } from "../schemas/watchlistSchema";

const router = Router();
const controller = new WatchlistController();

router.get("/", controller.getWatchlistData);
router.post("/",validatorHandler(watchlistSchema, "body"), controller.addWatchlist);
router.get("/:code", controller.getWatchlistByCode);
router.delete("/:id", controller.deleteWatchlist);




export default router;
