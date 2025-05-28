 import express, { Router } from 'express';
const propertyRouter  = express.Router();

 import { addProperties, deleteProperty, editProperty, getProperty } from '../controllers/propertyController.js';
import { auth } from '../middlewares/auth.js';
 propertyRouter.post('/addProperty' , auth , addProperties);

propertyRouter.get('/getProperty' , getProperty);

propertyRouter.put('/updateProperty/:id' , auth , editProperty);
propertyRouter.delete('/deleteProperty/:id' , auth , deleteProperty);
export default propertyRouter;
