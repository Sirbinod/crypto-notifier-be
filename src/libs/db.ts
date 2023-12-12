import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://sarbin:sarbin@cluster0.2heztbd.mongodb.net/?retryWrites=true&w=majority";

  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export { connectToDatabase };
