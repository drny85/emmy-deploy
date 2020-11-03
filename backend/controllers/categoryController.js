import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

export const addCategory = asyncHandler( async(req, res, next) => {
    const {name} = req.body;

    const exists = await Category.findOne({name});
    if (exists) {
        res.status(400)
        throw new Error(`${name} already exists`)
    }

    const category = await Category.create({name})
    if (category) {
        return res.json(category)
    } else {
        throw new Error('error adding category')
    }
})

export const getCategories = asyncHandler( async(req, res, next) => {
    const categories = await Category.find();
    return res.json(categories)
})

export const updateCategory = asyncHandler( async(req, res, next)=> {
    const id = req.params.id;
    const {name} = req.body
    const found = await Category.findByIdAndUpdate(id, {name}, {new: true});
   
    if (found) {
        
      console.log(found)
       return res.status(200).json(found)
    } else {
        res.status(400)
        throw new Error('not category found')
    }
})

export const deleteCategory = asyncHandler(async(req, res, next) => {
    const id = req.params.id
    await Category.findByIdAndDelete(id)
    return res.json(true)
})
