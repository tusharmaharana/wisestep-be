import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import keys from './config/keys';

const app = express();

mongoose
  .connect(keys.dbHost)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error while connecting to MongoDB', err));

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

app.get('/api', (req: Request, res: Response) => {
  res.send({ 'Hello World': 'This is my first API' });
});

app.listen(keys.port, () => {
  console.log(`server is running on port ${keys.port}`);
});
