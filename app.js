import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

// database
import connectDB from './db/connect.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log('Successfully connected to the database');
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();