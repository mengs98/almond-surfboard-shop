import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// database
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

// middleware
import errorHandlerMiddleware from './middleware/error-handler.js';

const app = express();
dotenv.config();

app.use(morgan('tiny'));
app.use(express.json()); // to access the json data in our req.body
app.use(cookieParser(process.env.JWT_SECRET)); // // with the argument, we are signing our cookies

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(errorHandlerMiddleware);

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
