import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  PRODUCT_ERROR,
  PRODUCT_LOADING,
  RESET_PRODUCT,
  SET_PRODUCT,
  UPDATE_PRODUCT,
} from './types';

import axios from '../../utils/axios';
import responseError from '../../utils/responseError';

const getProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LOADING });
    const { data } = await axios.get('/api/products');

    dispatch({ type: GET_PRODUCTS, payload: data });
  } catch (error) {
    console.log('Error getting products', error);
    dispatch({ type: PRODUCT_ERROR, payload: responseError(error) });
  }
};

const addProduct = (product) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    if (!user) {
      dispatch({ type: PRODUCT_ERROR, payload: 'not authorized' });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch({ type: PRODUCT_LOADING });
    const { data } = await axios.post('/api/products', product, config);

    dispatch({ type: ADD_PRODUCT, payload: data });
  } catch (error) {
    console.log(responseError(error));
    dispatch({ type: PRODUCT_ERROR, payload: responseError(error) });
  }
};

const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LOADING });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({ type: SET_PRODUCT, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: PRODUCT_ERROR, payload: responseError(error) });
  }
};

const updateProduct = (product) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    if (!user) {
      dispatch({ type: PRODUCT_ERROR, payload: 'not authorized' });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch({ type: PRODUCT_LOADING });
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );
    dispatch({ type: UPDATE_PRODUCT, payload: data });
    return true;
  } catch (error) {
    console.error(error);
    dispatch({ type: PRODUCT_ERROR, payload: responseError(error) });
    return false;
  }
};

const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    if (!user) {
      dispatch({ type: PRODUCT_ERROR, payload: 'not authorized' });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch({ type: PRODUCT_LOADING });
    await axios.delete(`/api/products/${id}`, config);
    dispatch({ type: DELETE_PRODUCT, payload: id });

    return true;
  } catch (error) {
    console.error(error);
    dispatch({ type: PRODUCT_ERROR, payload: responseError(error) });
    return false;
  }
};

const resetProduct = (dispatch) => (dispatch) => {
  dispatch({ type: RESET_PRODUCT });
};

export {
  getProducts,
  addProduct,
  getProductById,
  resetProduct,
  updateProduct,
  deleteProduct,
};
