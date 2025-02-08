import express from 'express';
import morgan from 'morgan';
import { router as ContactRouter } from './Routes/ContactRouter.js';
import { AppDataSource } from './data-source.js'; // Make sure this path is correct

const app = express();

async function initializeApp() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    // Middleware
    app.use(morgan('dev'));
    app.use(express.json());
    // Routes
    app.use('/contacts', ContactRouter);
    // Start server
    app.listen(3000);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

initializeApp();
