import responseError from '../../utils/responseError';
import {
  ADD_CATEGORY,
  CATEGORY_ERROR,
  GET_CATEGORIES,
  SET_LOADING,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CLEAR_ERROR,
  CATEGORY_LOADING,
} from './types';
import axios from '../../utils/axios';

export const addCategory = (name) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    setLoading();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post('/api/categories', { name }, config);
    dispatch({ type: ADD_CATEGORY, payload: data });
    return true;
  } catch (error) {
    console.error(error);
    dispatch({ type: CATEGORY_ERROR, payload: responseError(error) });
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
    return false;
  }
};

export const getCategories = () => async (dispatch) => {
  try {
    setLoading();
    const { data } = await axios.get('/api/categories');
    dispatch({ type: GET_CATEGORIES, payload: data });
  } catch (error) {
    console.error(error);
    dispatch({ type: CATEGORY_ERROR, payload: responseError(error) });
  }
};

export const updateCategory = (category) => async (dispatch, getState) => {
  try {
    const {
      userData: { user },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading();
    const { data } = await axios.put(
      `/api/categories/${category._id}`,
      category,
      config
    );
    dispatch({ type: UPDATE_CATEGORY, payload: { _id: category._id, data } });
    return true;
  } catch (error) {
    console.error(error);
    dispatch({ type: CATEGORY_ERROR, payload: responseError(error) });
    return false;
  }
};

export const deleteCategory = (id) => async (dispatch, getState) => {
  try {
    setLoading();
    const {
      userData: { user },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios.delete(`/api/categories/${id}`, config);

    dispatch({ type: DELETE_CATEGORY, payload: id });
  } catch (error) {
    console.log(error);
    dispatch({ type: CATEGORY_ERROR, payload: responseError(error) });
    setTimeout(() => {
      dispatch(clearError());
    }, 4000);
  }
};

const setLoading = () => (dispatch) => dispatch({ type: CATEGORY_LOADING });

const clearError = () => (dispatch) => dispatch({ type: CLEAR_ERROR });
