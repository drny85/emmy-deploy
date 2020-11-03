import {
  ADD_PRODUCT,
  GET_PRODUCTS,
  PRODUCT_ERROR,
  DELETE_PRODUCT,
  RESET_PRODUCT,
  SET_PRODUCT,
  UPDATE_PRODUCT,
  PRODUCT_LOADING,
} from '../actions/types';

const initialState = {
  products: [],
  product: null,
  error: false,
  loading: false,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: [...action.payload],
        loading: false,
      };

    case UPDATE_PRODUCT:
      const newProducts = state.products.filter(
        (p) => p._id !== action.payload._id
      );
      return {
        ...state,
        loading: false,
        error: false,
        products: [...newProducts, action.payload],
      };

    case SET_PRODUCT:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };

    case RESET_PRODUCT:
      return {
        ...state,
        product: null,
        loading: false,
      };
    case PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        loading: false,
        products: [...state.products.filter((p) => p._id !== action.payload)],
      };
    case PRODUCT_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_PRODUCT:
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
      };
    default:
      return state;
  }
};

export default productsReducer;
