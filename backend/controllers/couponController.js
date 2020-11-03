import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';

export const addCoupon = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const coupon = await Coupon.create(body);
  if (!coupon) {
    res.status(400);
    throw new Error('error adding coupon');
  }

  return res.json(coupon);
});

export const getCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({ code: code });
  if (!coupon) {
    res.status(400);
    throw new Error('invalid coupon');
  }

  return res.json(coupon);
});
