import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const signUp = asyncHandler(async (req, res) => {
  const { email, password, name, lastName } = req.body;
  email.trim().toLowerCase();

  const found = await User.findOne({ email }).populate('store');
  if (found) {
    res.status(400);
    throw new Error(`email: ${email} is already taken`);
  }
  const user = new User({ name, password, email, lastName });

  const token = user.generateToken(user._id);

  const userSaved = await user.save();
  const { _id, isAdmin } = userSaved;
  if (userSaved) {
    return res
      .status(200)
      .json({ _id, name, lastName, email, isAdmin, token, store: found.store });
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
