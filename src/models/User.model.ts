import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  image: string;
  address: string;
  accessToken: string;
  refreshToken: string;
}

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },
  image: { type: String },
  address: {type: String},
  accessToken: { type: String },
  refreshToken: { type: String },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;