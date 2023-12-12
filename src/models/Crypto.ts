import mongoose from "mongoose";
import { CryptoInterface } from "../interfaces/cryptoInterface";



const cryptoSchema = new mongoose.Schema<CryptoInterface>({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: { type: Number },
  change24h: { type: Number },
});

const CryptoModel = mongoose.model("CryptoData", cryptoSchema);

export { CryptoModel };
