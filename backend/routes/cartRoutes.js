import express from 'express';

const router = express.Router();

import {
  addToCart,
  createCart,
  getCart,
  clearCart,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect, admin } from '../middleware/protectMiddleware.js';

router.route('/').post(addToCart).get(createCart);
router.delete('/:cartId/:productId', removeFromCart);
router.route('/:id').get(getCart).put(clearCart);

export default router;
