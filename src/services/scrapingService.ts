import axios from "axios";
import { CryptoModel } from "../models/Crypto";
import schedule from "node-schedule";

const API_URL =
  process.env.COIN_RANKING_BASE_URL || "https://api.coinranking.com/v2/coins";
const DEFAULT_INTERVAL = 5; // minutes

export class CryptoScraper {
  private interval: number;

  constructor(interval = DEFAULT_INTERVAL) {
    this.interval = interval;
  }

  public async scrapeData(): Promise<void> {
    try {
      const response = await axios.get(API_URL);
      const data = response?.data?.data?.coins;

      for (const coin of data) {
        const {  iconUrl, symbol, name, price, marketCap, change } = coin;

        const cryptoData = {
          image: iconUrl,
          name,
          code: symbol,
          price,
          marketCap,
          change24h: change,
        };

        await CryptoModel.findOneAndUpdate(
          { code:symbol },
          { $set: cryptoData },
          { upsert: true, new: true }
        );
      }

      console.log(`Data scraped successfully at ${new Date()}`);
    } catch (error) {
      console.error(`Error scraping data:`, error);
    }
  }

  public async startScraping(): Promise<void> {
    const data = await CryptoModel.find();
    if (data.length <= 0) {
      console.log(`Starting scraping process`);
      await this.scrapeData();
    }
    console.log(
      `Starting scraping process with interval: ${this.interval} minutes`
    );
    schedule.scheduleJob(`*/${this.interval} * * * *`, async () => {
      await this.scrapeData();
    });
  }
}
