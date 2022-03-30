import nodeMailer from 'nodemailer';
import keys from '../config/keys';

export const transporter = nodeMailer.createTransport({
  service: 'hotmail',
  auth: {
    user: keys.emailId,
    pass: keys.password
  }
});

export const options = (receiverEmail: string, pin: number) => {
  return {
    from: keys.emailId,
    to: receiverEmail,
    subject: 'Your security pin',
    text: `Your 4 digit pin is ${pin}`
  };
};
