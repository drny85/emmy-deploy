import express from 'express';
import {
  getStore,
  createOrUpdateStore,
} from '../controllers/storeController.js';
import { admin, protect } from '../middleware/protectMiddleware.js';

const router = express.Router();

router.post('/create', protect, admin, createOrUpdateStore);

router.get('/:id', protect, admin, getStore);

export default router;
