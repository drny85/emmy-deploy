import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendEmail } from './emailController.js';

dotenv.config();

export const signUp = asyncHandler(async (req, res) => {
  const { email, password, name, lastName } = req.body;
  email.trim().toLowerCase();

  const found = await User.findOne({ email });
  if (found) {
    res.status(400);
    throw new Error(`email: ${email} is already taken`);
  }
  const user = await User.create({ name, password, email, lastName });

  const token = user.generateToken(user._id);

  const { _id, isAdmin } = user;
  if (user) {
    return res
      .status(200)
      .json({ _id, name, lastName, email, isAdmin, token, store: user.store });
  }

  res.status(400);
  throw new Error('an error ocurred');
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const id = req.params ? req.params.id : null;
  console.log('ID', id);
  const user = await User.findById(id).select('-password').populate('store');

  const token = user.generateToken(user._id);
  if (user) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      token,
      store: user.store,
    });
  } else {
    res.status(400);
    throw new Error('no user found');
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const found = await User.findOne({ email }).populate('store');

  if (!found) {
    res.status(400);
    throw new Error('invalid email or password');
  }

  const match = await found.matchPassword(password);
  if (!match) {
    res.status(400);
    throw new Error('invalid email or password');
  }
  const token = found.generateToken(found._id);
  return res.json({
    _id: found._id,
    name: found.name,
    email: found.email,
    lastName: found.lastName,
    isAdmin: found.isAdmin,
    store: found.store,
    token,
  });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('store');
  if (user) {
    return res.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      store: user.store,
    });
  } else {
    res.status(401);
    throw new Error('not user found');
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const tokenString = req.params.token;
  const { password } = req.body;
  const user = await User.findOne({
    resetToken: tokenString,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('invalid or expired link');
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  const token = user.generateToken(user._id);
  await user.save();

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    store: user.store,
    token,
  });
});

export const resetPasswordLink = asyncHandler(async (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(400);
      throw new Error('error resetting password');
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('no email found');
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const url = `${req.protocol}://${req.hostname}:3000${req.url}/${token}`;

    const msg = {
      to: req.body.email,
      from: 'emmydashartsy@noreply.com',
      subject: 'Password Reset',
      html: `
            <!DOCTYPE html>
    <html lang="en" style="box-sizing: border-box; margin: 0; padding: 0;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- <link rel="stylesheet" href="styles.css"> -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <title>Email</title>
        
    </head>
    <body style="box-sizing: border-box; margin: 0; padding: 0; min-width: 100%; min-height: 100%; font-family: 'Roboto', sans-serif;">
        <div class="container" style="box-sizing: border-box; padding: 0; background: linear-gradient(50deg, #ffffff, rgb(235, 229, 229)); background-size: cover; min-width: 100vw; min-height: 100vh; margin: auto; position: relative;">
            <div class="content" style="box-sizing: border-box; margin: 0; padding: 0; position: absolute; left: 50%; top: 50%; text-align: center; transform: translate(-50%, -50%);">
                <p class="p" style="box-sizing: border-box; font-size: 1.1rem; padding: 10px; margin: 1rem;">You requested to reset your password </p>
                
                <a class="btn" href="${url}" style="box-sizing: border-box; margin: 0; margin-top: 1.5rem; padding: 10px 30px; border: none; background-color: #01579b; color: #eee; cursor: pointer; transition: all 250ms ease-in; border-radius: 2px; display: inline-block; font-size: 1.1rem; text-decoration: none; max-width: 15rem; text-align: center;">Reset Password</a>
            </div>
        </div>
        
    </body>
    </html>
    
            `,
    };

    await sendEmail(msg);

    return res.status(200).send('email has been sent');
  });
});
