import {
  USER_ERROR,
  USER_LOADING,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SIGN_UP,
} from '../actions/types';

const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGN_UP:
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
      };

    case USER_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
      };

    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
        users: [],
      };

    case USER_ERROR:
      return {
        ...state,
        user: null,
        users: [],
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;
