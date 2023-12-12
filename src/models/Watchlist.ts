import mongoose, { Schema, Types } from "mongoose";

interface WatchlistInterface {
  userId: string;
  code: string;
  minPrice: number;
  maxPrice: number;
  crypto: Types.ObjectId;
}

const watchlistSchema = new mongoose.Schema<WatchlistInterface>({
  userId: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
});

const WatchlistModel = mongoose.model("Watchlist", watchlistSchema);

watchlistSchema.add({
  crypto: {
    type: Schema.Types.ObjectId,
    ref: "CryptoData",
  },
});

export { WatchlistInterface, WatchlistModel };
