 import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.connect(url)
  .then(() => {
    console.log("mongodb atlas connected ");
  })
  .catch((err) => {
    console.log(err?.message);
  });

mongoose.connection.on("connected", () => {
  console.log("mongoose connected to db");
});

mongoose.connection.on("err", (err) => {
  console.log(err?.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
