import express, { Request, Response } from "express";

import cryptoRoutes from "./cryptoRoutes";
import watchlistRoutes from "./watchlistRoutes";
import authRoutes from "./authRoutes"
import isAuthenticated from "../middlewares/authHandler";

const router = express.Router();

// crypto routes
router.use("/crypto", cryptoRoutes);

// watchlist routes
router.use("/watchlist",isAuthenticated, watchlistRoutes);

// auth routes
router.use("/auth", authRoutes);

  // To catch unavailable route
  router.use('/*', (req:Request, res:Response) => {
    res.status(404).json({ status: false, msg: 'Route Not Found : Crypto Notifier' });
  });

export default router;
