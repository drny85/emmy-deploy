import axios from '../../utils/axios';
import responseError from '../../utils/responseError';
import {
  USER_ERROR,
  USER_LOADING,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGN_UP,
} from './types';
export const signup = ({ name, lastName, email, password }) => async (
  dispatch
) => {
  try {
    dispatch({ type: USER_LOADING });
    const { data } = await axios.post('/api/users/signup', {
      name,
      lastName,
      email,
      password,
    });
    dispatch({ type: USER_SIGN_UP, payload: data });
    localStorage.setItem('emmyUserData', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    dispatch({ type: USER_ERROR, payload: responseError(error) });
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    const { data } = await axios.post('/api/users/login', { email, password });

    dispatch({ type: USER_LOGIN, payload: data });
    localStorage.setItem('emmyUserData', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    dispatch({ type: USER_ERROR, payload: responseError(error) });
  }
};

export const autoLoginUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOADING });
    const { data } = await axios.get('/api/users/' + user._id);
    dispatch({ type: USER_LOGIN, payload: data });
    localStorage.setItem('emmyUserData', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    dispatch({ type: USER_ERROR, payload: responseError(error) });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: USER_LOADING });
  dispatch({ type: USER_LOGOUT });
  localStorage.removeItem('emmyUserData');
};

export const updateUserStore = (userInfo) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOADING });
    const {
      userData: { user },
    } = getState();

    if (!user) {
      dispatch({ type: USER_ERROR, payload: 'not authorized' });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(`/api/store/create`, userInfo, config);
    console.log(data);
    dispatch({ type: USER_LOGIN, payload: data });
  } catch (error) {
    console.error(responseError(error));
  }
};

const setLoading = () => (dispatch) => dispatch({ type: USER_LOADING });
