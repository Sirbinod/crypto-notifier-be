import { NextFunction, Request, Response } from "express";
import { WatchlistModel } from "../models/Watchlist";
import { AuthenticatedRequest } from "../middlewares/authHandler";
import { CryptoModel } from "../models/Crypto";

export class WatchlistController {
  public async getWatchlistData(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await WatchlistModel.find({
        userId: req.userId,
      })
        .populate("crypto")
        .exec();

      res
        .status(200)
        .json({ status: true, message: "Watchlists found successfully", data });
    } catch (error) {
      next(error);
    }
  }

  public async addWatchlist(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.body;
      const crypto = await CryptoModel.findOne({ code });
      const newObj = { ...req.body, userId: req?.userId, crypto };
      await WatchlistModel.create(newObj);
      res
        .status(201)
        .json({ status: true, message: "Watchlists created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async getWatchlistByCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await WatchlistModel.findOne({ code: req.body });
      res
        .status(200)
        .json({ status: true, message: "Watchlist found successfully", data });
    } catch (error) {
      next(error);
    }
  }

  public async deleteWatchlist(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = await WatchlistModel.findOneAndDelete({ _id: id });
      res.status(200).json({
        status: true,
        message: "Watchlists deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
