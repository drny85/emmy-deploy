import express from 'express';
import { contactUs } from '../controllers/contactusController.js';

const router = express.Router();

router.route('/').post(contactUs);

export default router;
