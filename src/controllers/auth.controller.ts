import { Request, Response } from 'express';
import User from '../models/User.model';
const verifyRefreshToken = require('../utils/verifyRefreshToken');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RedisClient from '../config';

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: '180m' });
};

const generateRefreshToken = (): string => {
  return jwt.sign({}, process.env.REFRESH_SECRET_KEY!, { expiresIn: '7d' });
};

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, image, address } = req.body;
    if (!username ||
      !email ||
      !password) {
      return res.status(400).json({ success: false, message: 'Please enter the required details' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    let userObj = {
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
      image: image,
      address: address
    };
    const user = new User(userObj);
    await user.save();

    // Cache the user data in Redis
    const key = `user:${user._id}`;
    const value = JSON.stringify(user);

    RedisClient.set(key, value, (err, reply) => {
      if (err) {
        console.error('Error caching user data in Redis:', err);
      } else {
        console.log('User data cached in Redis:', reply);
      }
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error });
  }
};

const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;

    verifyRefreshToken(refreshToken)
      .then(async (tokenDetails: any) => {

        const { email, id } = tokenDetails.tokenDetails;

        const payload = {
          email: email,
          id: id,
        };

        const accessToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY!, {
          expiresIn: '5h',
        });

        await User.updateOne(
          { _id: id },
          { $set: { accessToken: accessToken } }
        );

        return res.status(200).json({
          success: true,
          accessToken,
          message: 'Access token created successfully',
        });
      })
      .catch((error: any) =>
        res.status(400).json({
          success: false,
          message: error.message,
        })
      );

  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const uploadImage = async (req: Request, res: Response) => {
  try {

    return res.status(200).json({ success: true, imageUrl: req.body.imageUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Error uploading image' });
  }
}

export default {
  register,
  login,
  getNewAccessToken,
  uploadImage
};
