import axios from '../../utils/axios';
import responseError from '../../utils/responseError';
import {
  GET_ORDERS,
  GET_ORDER_BY_ID,
  ORDER_ERROR,
  ORDER_LOADING,
  PLACE_ORDER,
  RESET_ORDER,
} from './types';

export const placeOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LOADING });
    const { data } = await axios.post('/api/orders', order);
    dispatch({ type: PLACE_ORDER, payload: data });

    return data._id;
  } catch (error) {
    console.error(responseError(error));
  }
};

export const getOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LOADING });
    const { data } = await axios.get('/api/orders');
    dispatch({ type: GET_ORDERS, payload: data });
  } catch (error) {
    console.error(responseError(error));
    dispatch({ type: ORDER_ERROR, payload: responseError(error) });
  }
};

export const getOrderById = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LOADING });
    const { data } = await axios.get(`/api/orders/${id}`);
    dispatch({ type: GET_ORDER_BY_ID, payload: data });
  } catch (error) {
    console.error(error);
    dispatch({ type: ORDER_ERROR, payload: responseError(error) });
  }
};

export const updateOrder = (order) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    if (!user) {
      dispatch({ type: ORDER_ERROR, payload: 'not authorized' });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    dispatch({ type: ORDER_LOADING });
    const { data } = await axios.put(`/api/orders/${order._id}`, order, config);
    dispatch({ type: GET_ORDER_BY_ID, payload: data });
  } catch (error) {
    console.error(error);
    dispatch({ type: ORDER_ERROR, payload: responseError(error) });
  }
};

export const resetOrder = () => (dispatch) => dispatch({ type: RESET_ORDER });

const setLoading = () => (dispatch) => dispatch({ type: ORDER_LOADING });
