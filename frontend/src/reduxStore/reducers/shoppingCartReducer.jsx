import {
  ADD_TO_CART,
  CART_LOADING,
  CLEAR_CART,
  GET_CART,
  REMOVE_FROM_CART,
} from '../actions/types';

const initialState = {
  cartItems: [],
  loading: false,
  total: 0,
  quantity: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const product = action.payload;

      const inCart = state.cartItems.find((i) => i.product._id === product._id);
      if (inCart) {
        const index = state.cartItems.findIndex(
          (i) => i.product._id === product._id
        );

        const newProducts = [...state.cartItems];

        newProducts[index].qty = inCart.qty + 1;
        return {
          ...state,
          loading: false,
          cartItems: [...newProducts],
          quantity: state.quantity + 1,
          total: state.total + product.price,
        };
      } else {
        return {
          ...state,
          loading: false,
          cartItems: [...state.cartItems, product],
          quantity: state.quantity + 1,
          total: state.total + product.price,
        };
      }

    case REMOVE_FROM_CART:
      const item = action.payload;
      const exists = state.cartItems.find((i) => i.product._id === item._id);
      if (exists) {
        const index = state.cartItems.findIndex(
          (i) => i.product._id === item._id
        );
        const newProducts = [...state.cartItems];

        if (exists.qty > 1) {
          newProducts[index].qty = exists.qty - 1;
          return {
            ...state,
            loading: false,
            error: false,
            cartItems: [...newProducts],
            quantity: state.quantity - 1,
            total: state.total - item.price,
          };
        } else {
          return {
            ...state,
            loading: false,
            error: false,
            cartItems: [
              ...state.cartItems.filter((p) => p.product._id !== item._id),
            ],
            quantity: state.quantity - 1,
            total: state.total - item.price,
          };
        }
      } else {
        return state;
      }

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        loading: false,
        total: 0,
        quantity: 0,
        error: null,
      };

    case GET_CART:
      return {
        ...state,
        loading: false,
        cartItems: action.payload.items,
        total: action.payload.total,
        quantity: action.payload.quantity,
      };
    case CART_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};
