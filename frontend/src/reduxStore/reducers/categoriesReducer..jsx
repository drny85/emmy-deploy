import {
  ADD_CATEGORY,
  CATEGORY_ERROR,
  CATEGORY_LOADING,
  CLEAR_ERROR,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
} from '../actions/types';

const initialState = {
  categories: [],
  category: null,
  error: null,
  loading: false,
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [action.payload, ...state.categories],
        loading: false,
        error: null,
      };

    case CATEGORY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        error: null,
        loading: false,
        categories: action.payload,
      };
    case UPDATE_CATEGORY:
      const newCategories = state.categories.filter(
        (c) => c._id !== action.payload._id
      );
      return {
        ...state,
        loading: false,
        error: false,
        categories: [action.payload.data, ...newCategories],
      };
    case CATEGORY_LOADING:
      return {
        ...state,
        loading: true,
      };

    case DELETE_CATEGORY:
      return {
        ...state,
        loading: false,
        error: false,
        categories: state.categories.filter((c) => c._id !== action.payload),
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        loading: false,
      };

    default:
      return state;
  }
};

export default categoriesReducer;
