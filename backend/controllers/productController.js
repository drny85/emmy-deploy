import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

export const addProduct = asyncHandler(async (req, res) => {
  console.log(req.user);
  const {
    name,
    description,
    price,
    category,
    imageUrl,
    estimatedDelivery,
    available,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    imageUrl,
    category,
    estimatedDelivery,
    available,
    user: req.user._id,
  });

  if (!product) {
    res.status(400);
    throw new Error('product was not added');
  }

  return res.json(product);
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('category');

  return res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('no product found or valid ID');
  }
  const product = await Product.findById(id);
  return res.json(product);
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const {
    name,
    description,
    price,
    imageUrl,
    category,
    estimatedDelivery,
    available,
  } = req.body;
  const updated = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      imageUrl,
      category,
      estimatedDelivery,
      available,
    },
    { new: true }
  );
  if (updated) {
    return res.json(updated);
  } else {
    res.status(400);
    throw new Error('error updating product');
  }
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('no product found or valid ID');
  }
  const product = await Product.findById(id);
  if (!product) {
    res.status(400);
    throw new Error(`not product found with id ${id}`);
  }

  await product.remove();
  return res.json({ msg: 'product deleted' });
});
