import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import keys from './config/keys';
import authRouter from './routes/authRoutes';
import baseRouter from './routes/baseRoutes';

const app = express();

mongoose
  .connect(keys.dbHost)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error while connecting to MongoDB', err));

app.use(
  cors({
    origin: keys.clientUrl,
    credentials: true
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/api', (req: Request, res: Response) => {
//   console.log(req.session);

//   res.cookie;
//   res.send({ message: 'This is my first API' });
// });

app.use('/api/auth', authRouter);
app.use('/api', baseRouter);

app.listen(keys.port, () => {
  console.log(`server is running on port ${keys.port}`);
});
