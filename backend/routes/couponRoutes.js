import express from 'express';
import {
  addCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

import { protect, admin } from '../middleware/protectMiddleware.js';

router
  .route('/')
  .post(protect, admin, addCoupon)
  .get(protect, admin, getCoupons);
router
  .route('/:id')
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon);
router.route('/get').post(getCoupon);

export default router;
