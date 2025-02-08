import express from 'express';
import morgan from 'morgan';
import { router as ContactRouter } from './Routes/ContactRouter.js';
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/contacts', ContactRouter);

app.listen(3000, () => {
  console.log(`🚀 Server running at http://localhost:3000`);
});
