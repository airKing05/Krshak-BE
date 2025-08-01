import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from "../../models/user/user.model";
import { MESSAGES } from '../../config/messages';

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: MESSAGES.INVALID_CREDENTIALS });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};


export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select('-password -createdAt -updatedAt -_id -__v'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
