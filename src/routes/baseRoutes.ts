import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import { User } from '../models/User';
import { findOneQuery, findQuery } from '../utils/generalQueries';
import { IUser, IUserData } from './authRoutes';

const router = express.Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const { userId } = req.user as unknown as IUserData;
  try {
    const anyUser = await findOneQuery(User, { _id: userId });
    const users = (await findQuery(User, { email: anyUser.email, isLoggedIn: true })) as unknown as IUser[];
    console.log(users);

    if (users.length > 1) {
      res.status(402).send({ message: 'Another session is running', previousSessionId: users[0]._id });
      return;
    }
    if (users.length === 1) {
      res.status(200).send({ message: 'User is logged in' });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;
