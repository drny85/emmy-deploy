import responseError from '../../utils/responseError';
import axios from '../../utils/axios';

const {
  ADD_TO_CART,
  CART_ERROR,
  REMOVE_FROM_CART,
  CART_LOADING,
  GET_CART,
  CLEAR_CART,
} = require('./types');

const addToCart = (product) => async (dispatch) => {
  try {
    dispatch({ type: CART_LOADING });
    const item = localStorage.getItem('emmyCart');
    const cartId = JSON.parse(item);

    const { data } = await axios.post('/api/cart', { cartId, product });

    dispatch({ type: ADD_TO_CART, payload: data });
  } catch (error) {
    console.log('error');
    console.error(responseError(error));
  }
};

const removeFromCart = (product) => async (dispatch) => {
  try {
    dispatch({ type: CART_LOADING });
    const item = localStorage.getItem('emmyCart');
    const cartId = JSON.parse(item);

    const { data } = await axios.delete(`/api/cart/${cartId}/${product._id}`);
    console.log('DEL', data);
    dispatch({ type: REMOVE_FROM_CART, payload: product });
  } catch (error) {
    console.log(responseError(error));
    dispatch({ type: CART_ERROR, payload: responseError(error) });
  }
};

const createCart = () => async (dispatch) => {
  try {
    dispatch({ type: CART_LOADING });
    const { data } = await axios.get('/api/cart');

    return data;
  } catch (error) {
    console.error(error);
  }
};

const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: CART_LOADING });
    const item = localStorage.getItem('emmyCart');
    const cartId = JSON.parse(item);

    const { data } = await axios.put(`/api/cart/${cartId}`);
    dispatch({ type: CLEAR_CART });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getCartById = () => async (dispatch) => {
  try {
    dispatch({ type: CART_LOADING });
    const item = localStorage.getItem('emmyCart');
    const cartId = JSON.parse(item);
    const { data } = await axios.get(`/api/cart/${cartId}`);

    dispatch({ type: GET_CART, payload: data });
  } catch (error) {
    console.error(responseError(error));
  }
};

export { addToCart, removeFromCart, createCart, getCartById, clearCart };
