import { model, Schema } from 'mongoose';

export const User = model(
  'users',
  new Schema({
    email: { type: String, required: true },
    pin: { type: Number, minlength: 4, maxlength: 4 },
    fingerPrint: { type: String, required: true },

    isLoggedIn: { type: Boolean, default: false }
  })
);
