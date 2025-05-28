 import express from 'express';
const router = express.Router();

import { userRegister , login } from '../controllers/userController.js';
 
 
router.post("/register", userRegister);
router.post("/login", login);




export default router;
