import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import keys from '../config/keys';
import auth from '../middleware/auth';
import { User } from '../models/User';
import { options, transporter } from '../services/nodeMailer';
import { createDocumentQuery, findOneAndUpdateQuery, findOneQuery } from '../utils/generalQueries';

const router = express.Router();

export interface Message {
  message: string;
}

interface IVerify {
  isVerified: boolean;
  pin: number;
}

export interface IUser {
  _id: string;
  email: string;
  isLoggedIn: boolean;
  pin: number;
}

export interface IUserData {
  userId: string;
  fpId: string;
  iat: number;
}

router.post('/login/verify', async (req: Request, res: Response) => {
  const { pin, token } = req.body;
  const { userId, fpId } = jwt.verify(token, keys.cookieKey) as IUserData;

  const user = (await findOneQuery(User, { _id: userId, fingerPrint: fpId })) as unknown as IUser;
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  const { pin: userPin } = user;
  if (pin !== userPin) {
    return res.status(403).send({ message: 'Invalid pin' });
  }
  await findOneAndUpdateQuery(User, { _id: userId, fingerPrint: fpId }, { isLoggedIn: true });
  return res
    .cookie('cookie-id', token, { sameSite: 'none', domain: `${keys.clientUrl}` })
    .status(200)
    .send({ message: 'User verified and logged in' });
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, fingerPrint } = req.body;

    if (!email) {
      res.status(400).send({ message: 'Email is required' });
      return;
    }
    // Validate if user exist in our database
    let user = (await findOneQuery(User, { email, fingerPrint })) as unknown as IUser;

    if (!user) {
      user = (await createDocumentQuery(User, { email, fingerPrint })) as unknown as IUser;
    }
    const token = jwt.sign({ userId: user._id, fpId: fingerPrint }, keys.cookieKey);

    const pin = Math.floor(Math.random() * 8999) + 1000;
    await findOneAndUpdateQuery(User, { _id: user._id }, { pin });

    // Send email to user
    transporter.sendMail(options(user.email, pin), (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    res.status(200).send({ isLoggedIn: user.isLoggedIn, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.get('/logout/current-session', auth, async (req: Request, res: Response): Promise<void | Message> => {
  try {
    console.log(req.user);
    const { userId, fpId } = req.user as unknown as IUserData;

    const user = (await findOneQuery(User, { _id: userId, fingerPrint: fpId })) as unknown as IUser;
    if (!user) {
      res.status(400).send({ message: 'User does not exist' });
    }
    await findOneAndUpdateQuery(User, { _id: userId, fingerPrint: fpId }, { isLoggedIn: false });
    res.status(200).send({ message: 'User logged out' });
  } catch (err) {
    console.log(err);
  }
});

router.post('/logout/previous-session', auth, async (req: Request, res: Response): Promise<void | Message> => {
  try {
    const { previousSessionId } = req.body;

    const user = (await findOneQuery(User, { _id: previousSessionId })) as unknown as IUser;
    if (!user) {
      res.status(400).send({ message: 'User does not exist' });
    }
    await findOneAndUpdateQuery(User, { _id: previousSessionId }, { isLoggedIn: false });
    res.status(200).send({ message: ' Previous User logged out' });
  } catch (err) {
    console.log(err);
  }
});

export default router;
