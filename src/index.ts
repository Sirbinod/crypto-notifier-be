import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./libs/db";
import routes from "./routes";
import { CryptoScraper } from "./services/scrapingService";
import errorHandler from "./middlewares/errorHandler";
import { Notification } from "./services/notificationService";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

// Use the global error handling middleware
app.use(errorHandler);

// app.use(express.static("public"));

connectToDatabase().then(() => {
  // // Start the server
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  });
 const io = new Server(server, {
   cors: {
     origin: "*",
     methods: ["GET", "POST"],
   },
 });
  const cryptoScraper = new CryptoScraper();
  const notificationServer = new Notification()

  // Start the scraping process
  cryptoScraper.startScraping();

  notificationServer.SendNotification(io);
}).catch((err) => {
  console.log(err);
  process.exit(1);
});;
