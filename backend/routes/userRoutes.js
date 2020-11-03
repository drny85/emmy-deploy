
import express from 'express'

const router = express.Router()

import {getUserById, getUserProfile, login, signUp} from '../controllers/userController.js'
import { protect } from '../middleware/protectMiddleware.js'


router.route('/signup').post(signUp)
router.route('/login').post(login)
router.get('/profile', protect, getUserProfile)
router.route('/:id').get(getUserById)



export default router;