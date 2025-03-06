import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("db  connected");
  } catch (error) {
    console.log(error);
  }
}

export default dbConnect;
