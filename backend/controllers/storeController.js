import asyncHandler from 'express-async-handler';
import Store from '../models/storeModel.js';
import User from '../models/userModel.js';

export const createOrUpdateStore = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const updatedAddres = {
    address: {
      street: body.address,
      apt: body.apt,
      state: body.state,
      city: body.city,
      zipcode: body.zipcode,
    },
    phone: body.phone,
    email: body.email,
    user: req.user._id,
    storeInfo: body.storeInfo,
    name: body.name,
  };

  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(400);
    throw new Error('not user found');
  }
  if (user.store) {
    console.log(user.store);
    const updated = await Store.findByIdAndUpdate(
      { _id: user.store },
      updatedAddres,
      { new: true }
    );
    if (!updated) {
      res.status(404);
      throw new Error('no store updated');
    }
    console.log('UPDATED', updated);

    const token = user.generateToken(req.user._id);
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      token,
      store: updated,
    });
  } else {
    const store = await Store.create(updatedAddres);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { store: store }
    )
      .select('-password')
      .populate('store');
    const token = updatedUser.generateToken(req.user._id);
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      lastName: user.lastName,
      token,
      store: updatedUser.store,
    });
  }
});

export const getStore = asyncHandler(async (req, res, next) => {
  const store = await Store.findOne({ user: req.user._id });
  if (!store) {
    res.status(404);
    throw new Error('not store found');
  }

  return res.json(store);
});
