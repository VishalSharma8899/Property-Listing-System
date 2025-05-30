
import express from "express";
import { getReceivedRecommendations, recommendProperty } from "../controllers/recommendController.js";
import { auth } from "../middlewares/auth.js";
const recommendationRouter = express.Router();


 
recommendationRouter.post('/properties/:propertyId/recommend/:userEmail', auth, recommendProperty);
recommendationRouter.get('/user/recommendations', auth, getReceivedRecommendations);
export default recommendationRouter;