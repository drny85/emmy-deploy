import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import asyncHandle from 'express-async-handler';
import { protect } from '../middleware/protectMiddleware.js';
import { sendEmail } from './emailController.js';

export const addToCart = asyncHandle(async (req, res, next) => {
  const { product, cartId } = req.body;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    res.status(400);
    throw new Error('no cart found');
  }
  const inCart = cart.items.find((p) => p.product._id === product.product._id);

  if (inCart) {
    const index = cart.items.findIndex(
      (i) => i.product._id === product.product._id
    );

    const count = cart.items[index].qty;
    await Cart.updateOne(
      { _id: cartId, 'items.product._id': product.product._id },
      {
        $set: {
          'items.$.qty': count + 1,
          total: cart.total + product.price,
          quantity: cart.quantity + 1,
        },
      }
    );

    return res.json(product.product);
  } else {
    cart.items.push(product);
    cart.quantity = cart.quantity + 1;
    cart.total = cart.total + product.price;

    await cart.save();

    return res.json(product);
  }
});

export const removeFromCart = asyncHandle(async (req, res, next) => {
  const { productId, cartId } = req.params;

  const product = await Product.findById(productId);
  const cart = await Cart.findById(cartId);

  if (!cart) {
    res.status(400);
    throw new Error('no cart found');
  }

  if (product) {
    const cartItems = [...cart.items];
    const index = cartItems.findIndex((i) => i.product._id === productId);
    console.log(index);
    const count = cart.items[index].qty;
    const price = cart.items[index].price;

    if (count > 1) {
      await Cart.updateOne(
        { _id: cartId, 'items.product._id': productId },
        {
          $set: {
            'items.$.qty': count - 1,
            total: cart.total - price,
            quantity: cart.quantity + -1,
          },
        }
      );
      return res.json(product);
    } else if (count === 1) {
      const cart = await Cart.findById(cartId);

      cart.items.splice(index, 1);
      cart.quantity = cart.quantity - 1;
      cart.total = cart.total - product.price;
      if (cart.quantity === 0) {
        cart.total = 0;
      }

      await cart.save();

      return res.json({ message: 'item removed' });
    }

    //const inCart = cart.items.find((i) => i.product._id === product._id);
  } else {
    console.log('no product');
  }
});

export const getCart = asyncHandle(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);

  return res.json(cart);
});

export const createCart = asyncHandle(async (req, res, next) => {
  const cart = await Cart.create({
    items: [],
  });

  if (cart) return res.json(cart._id);

  res.status(400);
  throw new Error('not cart created');
});

export const clearCart = asyncHandle(async (req, res, next) => {
  const cartId = req.params.id;
  const cart = await Cart.findByIdAndUpdate(cartId, {
    items: [],
    quantity: 0,
    total: 0,
  });

  if (cart) {
    return res.json(true);
  }

  res.status(400);
  throw new Error('no cart found');
});
