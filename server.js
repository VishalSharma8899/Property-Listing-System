import express from "express";
import dotenv from "dotenv";
import "./src/config/dbConnection.js";
import cors from "cors";
import redis from 'redis';
import bodyParser from "body-parser";
import router from "./src/routes/userRoutes.js";
import propertiesRouter from "./src/routes/propertiesRoutes.js";
import favoriteRouter from "./src/routes/favoritePropertiesRoutes.js";
import recommendationRouter from "./src/routes/recommendRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT;

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  
}); 
client.connect()
app.use("/", router);
app.use("/properties", propertiesRouter);
app.use("/favorite", favoriteRouter);
app.use("/recomndation" , recommendationRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
