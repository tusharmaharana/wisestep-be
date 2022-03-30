import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import { User } from '../models/User';
import { IUserData } from '../routes/authRoutes';
import { findOneQuery } from '../utils/generalQueries';

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies['cookie-id'];
  if (!token) {
    res.status(401).send({ message: 'Unauthorized request' });
  }
  try {
    const decoded = jwt.verify(token, keys.cookieKey) as IUserData;
    req.user = decoded as unknown as string;
    const user = await findOneQuery(User, { _id: decoded.userId, fingerPrint: decoded.fpId });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    if (user.isLoggedIn) {
      next();
      return;
    }
    res.status(403).send({ message: 'User not logged in' });
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized request' });
  }
};

export default auth;
