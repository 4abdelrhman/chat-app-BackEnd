import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password.length < 8) {
      return res
        .status(400)
        .json({ massage: 'Password must be at least 8 character.' });
    }

    if (!fullName || !email || !password) {
      return res.status(400).json({ massage: 'All fields are required .' });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ massage: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ massage: 'invalid user data.' });
    }
  } catch (error) {
    console.log('Error in sign up controller', error.message);
    res.status(500).json({ message: 'internal Server Error' });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ massage: 'Logged out successfully.' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ massage: 'Internal Server Error.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const uesrId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile Picture required.' });
    }

    const uploadRes = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      uesrId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('Error in updateProfile controller', error.message);
    res.status(500).json({ massage: 'Internal Server Error.' });
  }
};
