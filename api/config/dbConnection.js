import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.connect(url)
  .then(() => {
    console.log(" MongoDB Atlas connected");
  })
  .catch((err) => {
    console.log(" Connection error:", err?.message);
  });

mongoose.connection.on("connected", () => {
  console.log(" Mongoose connected to Database");
});

mongoose.connection.on("error", (err) => {
  console.log(" Mongoose error:", err?.message);
});

mongoose.connection.on("disconnected", () => {
  console.log(" Mongoose disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log(" Mongoose connection closed due to app termination");
  process.exit(0);
});
