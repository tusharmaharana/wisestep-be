import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import { User } from '../models/User';
import { findOneQuery, findQuery } from '../utils/generalQueries';
import { IUser, IUserData } from './authRoutes';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
  const { userId } = req.user as unknown as IUserData;
  try {
    const currentUser = await findOneQuery(User, { _id: userId });
    const users = (await findQuery(User, { email: currentUser.email, isLoggedIn: true })) as unknown as IUser[];
    if (users.length > 1) {
      const index = users.findIndex(user => user._id.toString() !== userId);
      res.status(209).send({ message: 'Another session is running', previousSessionId: users[index]._id });
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
