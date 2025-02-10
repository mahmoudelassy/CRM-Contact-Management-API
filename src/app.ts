import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router as ContactRouter } from './Routes/ContactRouter.js';
import { AppDataSource } from './data-source.js'; // Make sure this path is correct
import { errorHandler } from './Middlewares/errorHandler.js';

const app = express();
dotenv.config();

async function initializeApp() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    app.use(morgan('dev'));
    app.use(express.json());
    app.use('/contacts', ContactRouter);
    app.use(errorHandler);
    app.listen(process.env.APP_PORT || 3000);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

initializeApp();
