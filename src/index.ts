import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./libs/db";
import routes from "./routes";
import { CryptoScraper } from "./services/scrapingService";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1", routes);

connectToDatabase().then(() => {
  // // Start the server
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  });
  const cryptoScraper = new CryptoScraper();

  // Start the scraping process
  cryptoScraper.startScraping();
}).catch((err) => {
  console.log(err);
  process.exit(1);
});;
