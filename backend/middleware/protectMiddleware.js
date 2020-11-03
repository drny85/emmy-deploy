import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');
  console.log(token);
  if (!token) {
    res.status(401);
    throw new Error('not token provided');
  }

  try {
    const found = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(found, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    next(error);
    throw new Error('not authorized');
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, not an admin');
  }
};
