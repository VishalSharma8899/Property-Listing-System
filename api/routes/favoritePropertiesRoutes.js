import express from "express";
const favoriteRouter = express.Router();

import { auth } from "../middlewares/auth.js";
import {
  addFavoriteproperties,
  deleteFavoriteproperties,
  getUsersForFavoriteProperties,
} from "../controllers/favoriteController.js";

// { editproperties } from '../controllers/propertyController.js';

favoriteRouter.post("/addFavoriteproperties/:id", auth, addFavoriteproperties);
favoriteRouter.get(
  "/getFavoriteproperties",
  auth,
  getUsersForFavoriteProperties
);
//  propertiesRouter.put('/updateproperties/:id' , auth , editproperties);
favoriteRouter.delete(
  "/deleteFavoriteproperties/:id",
  auth,
  deleteFavoriteproperties
);
export default favoriteRouter;
