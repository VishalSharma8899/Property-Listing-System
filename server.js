 import express from 'express';
 import dotenv from 'dotenv';
import './src/config/dbConnection.js'
import mongoose from 'mongoose';
import cors from 'cors'
 
import bodyParser from 'body-parser'
import router from './src/routes/userRoutes.js'
import propertyRouter from './src/routes/propertyRoutes.js'
 dotenv.config();
 const app = express();
app.use(cors());
app.use(bodyParser.json())
const port =  process.env.PORT;

app.use('/' , router);
app.use('/property' , propertyRouter);
app.listen(  port ,() =>{
    console.log(`${port} is runing`)
} )

