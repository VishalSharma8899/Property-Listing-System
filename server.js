import express from "express";
import dotenv from "dotenv";
import "./src/config/dbConnection.js";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/routes/userRoutes.js";
import propertiesRouter from "./src/routes/propertiesRoutes.js";
import favoriteRouter from "./src/routes/favoritePropertiesRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT;

app.use("/", router);
app.use("/properties", propertiesRouter);
app.use("/favorite", favoriteRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
