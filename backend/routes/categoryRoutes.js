
import express from 'express'



const router = express.Router()

import {addCategory, getCategories, updateCategory, deleteCategory} from '../controllers/categoryController.js'
import {protect, admin} from '../middleware/protectMiddleware.js'


router.route('/').post(protect,admin, addCategory).get(getCategories)
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory)

export default router;