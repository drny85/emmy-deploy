import express from 'express';
import { addCoupon, getCoupon } from '../controllers/couponController.js';

const router = express.Router();

import { protect, admin } from '../middleware/protectMiddleware.js';

router.route('/').post(protect, admin, addCoupon);
router.route('/get').post(getCoupon);

export default router;
