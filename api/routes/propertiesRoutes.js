import express from "express";
const propertiesRouter = express.Router();

import {
  addProperties,
  deleteproperties,
  editproperties,
  getproperties,
} from "../controllers/propertyController.js";
import { auth } from "../middlewares/auth.js";
import { propertiesSearch } from "../controllers/searchingproperties.js";

propertiesRouter.post("/addproperties", auth, addProperties);
propertiesRouter.get("/getproperties", auth, getproperties);
propertiesRouter.put("/updateproperties/:id", auth, editproperties);
propertiesRouter.delete("/deleteproperties/:id", auth, deleteproperties);

propertiesRouter.get("/searchingProperties", auth, propertiesSearch);

export default propertiesRouter;
