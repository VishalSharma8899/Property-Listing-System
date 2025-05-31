import express from "express";
import dotenv from "dotenv";
import "./config/dbConnection.js";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes.js";
import propertiesRouter from "./routes/propertiesRoutes.js";
import favoriteRouter from "./routes/favoritePropertiesRoutes.js";
import recommendationRouter from "./routes/recommendRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT;


app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/auth", userRouter);
app.use("/properties", propertiesRouter);
app.use("/favorite", favoriteRouter);
app.use("/recomndation" , recommendationRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
