import fs from "fs";
import express from "express";
import http from "http";
import { Server } from "socket.io"; 
import { CryptoModel } from "../models/Crypto";
import { WatchlistModel } from "../models/Watchlist";
import { CryptoInterface } from "../interfaces/cryptoInterface";

export class Notification {
  public async SendNotification(io: Server): Promise<void> {
    // Define the log file path
    const logFilePath = "notification-log.txt";

    // Define a function to handle notifications
    const sendNotification = (message: string) => {
      // For now, log the message to a file
      fs.appendFileSync(
        logFilePath,
        `${new Date().toISOString()}: ${message}\n`
      );

      // Emit the notification to connected clients
      io.emit("notification", message);
    };

    // Define a function to check and send notifications
    const checkAndSendNotification = async (
      cryptoData: CryptoInterface | null,
      watchlist: any
    ) => {
      if (!cryptoData) {
        return; // Handle the case where cryptoData is null
      }

      const { minPrice, maxPrice, code } = watchlist;
      const { price, change24h } = cryptoData;

      if (price < minPrice) {
        sendNotification(
          `Alert: ${code} price is below the minimum threshold!`
        );
      } else if (price > maxPrice) {
        sendNotification(
          `Alert: ${code} price is above the maximum threshold!`
        );
      }

      if (change24h < 0) {
        const convPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price);
        sendNotification(
          `${code} is on the move. The price is down ${change24h}% in 24 hrs to ${convPrice}`
        );
      }
    };

    // Listen for changes in the CryptoData collection
    CryptoModel.watch().on("change", async (change) => {
      if (change.operationType === "update") {
        const cryptoData = await CryptoModel.findById(change.documentKey._id);
        const watchlists = await WatchlistModel.find({
          code: cryptoData?.code,
        }); // Use optional chaining

        watchlists.forEach((watchlist) => {
          checkAndSendNotification(cryptoData, watchlist);
        });
      }
    });
  }
}
