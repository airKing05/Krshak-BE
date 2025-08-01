import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user/user.model';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const email = 'anilraj.krshak@gmail.com';
  const password = 'admin123';

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists');
    process.exit();
  }

  const user = new User({ email, password });
  await user.save();
  console.log('✅ Admin created');
  process.exit();
};

createAdmin();
