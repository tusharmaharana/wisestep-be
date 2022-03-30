import { model, Schema } from 'mongoose';

export const Session = model(
  'sessions',
  new Schema({
    token: { type: String, required: true }
  })
);
