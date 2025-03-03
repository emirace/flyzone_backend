import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log("db already connected");
  } else {
    await mongoose.connect(MONGO_URI);
    console.log("db  connected");
  }
}

export default dbConnect;
