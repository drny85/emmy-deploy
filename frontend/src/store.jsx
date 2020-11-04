import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import categoriesReducer from './reduxStore/reducers/categoriesReducer.';
import ordersReducer from './reduxStore/reducers/ordersReducer';
import productsReducer from './reduxStore/reducers/productsReducer';
import cartReducer from './reduxStore/reducers/shoppingCartReducer';
import userReducer from './reduxStore/reducers/userReducer';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const reducer = combineReducers({
  productsData: productsReducer,
  cartData: cartReducer,
  userData: userReducer,
  categoriesData: categoriesReducer,
  ordersData: ordersReducer,
});

const store = createStore(
  reducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
