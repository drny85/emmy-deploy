import React, { useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import './index.css';
import ProductDetails from './pages/product/ProductDetails';
import ShoppingCartScreen from './pages/shopping/ShoppingCartScreen';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Signup from './pages/auth/Signup';
import AdminPage from './pages/admin/AdminPage';
import ProductList from './pages/admin/ProductList';
import NavBar from './components/nav/NavBar';
import AddProduct from './pages/admin/AddProduct';
import { useDispatch } from 'react-redux';
import { autoLoginUser } from './reduxStore/actions/userActions';
import ProfilePage from './pages/auth/ProfilePage';
import Login from './pages/auth/Login';
import ProductEdit from './pages/admin/ProductEdit';
import CategoryPage from './pages/categories/CategoryPage';
import { createCart, getCartById } from './reduxStore/actions/shoppingCart';

import ShippingPage from './pages/shopping/ShippingPage';
import OrderSummary from './pages/shopping/OrderSummary';
import MyOrders from './pages/shopping/MyOrders';
import OrderDetails from './pages/orders/OrderDetails';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import CouponsPage from './pages/admin/CouponsPage';
import AdminRoutes from './components/AdminRoutes';
import ProtectedRoutes from './components/ProtectedRoutes';
import PasswordReset from './pages/auth/PasswordReset';
import ResetPasswordLink from './pages/auth/ResetPasswordLink';
import ContactUs from './pages/contact/ContactUs';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#607d8b',
    },
  },
});

function generateCart(key, value) {
  const found = localStorage.getItem(key);
  if (found) {
    return localStorage.getItem(JSON.parse(found));
  }

  localStorage.setItem(key, JSON.stringify(value));
}

const saveCartId = async (dispatch) => {
  if (!localStorage.getItem('emmyCart')) {
    const data = await dispatch(createCart());
    generateCart('emmyCart', data);
  }
};

function App() {
  const dispatch = useDispatch();
  saveCartId(dispatch);

  useEffect(() => {
    const user = localStorage.getItem('emmyUserData');
    dispatch(getCartById());

    if (user && user !== undefined) {
      const data = JSON.parse(user);

      dispatch(autoLoginUser(data));
    }
  }, [dispatch]);
  //BEM
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ height: '100vh' }}>
          <NavBar />
          <Switch>
            <Route path="/cart" component={ShoppingCartScreen} />
            <ProtectedRoutes path="/profile" component={ProfilePage} />
            <Route path="/shipping" component={ShippingPage} />
            <Route path="/orders/:id" component={OrderDetails} />
            <ProtectedRoutes path="/orders" component={MyOrders} />
            <Route path="/order-summary" component={OrderSummary} />
            <Route path="/reset/:token" exact component={PasswordReset} />
            <Route path="/resetLink" exact component={ResetPasswordLink} />
            <Route path="/contact-us" exact component={ContactUs} />

            <AdminRoutes path="/admin/coupons" component={CouponsPage} />
            <AdminRoutes path="/admin/category" component={CategoryPage} />
            <AdminRoutes path="/admin/orders" component={AdminOrdersPage} />
            <AdminRoutes path="/admin/products" exact component={ProductList} />
            <AdminRoutes
              path="/admin/add/product"
              exact
              component={AddProduct}
            />
            <AdminRoutes
              path="/admin/product/edit/:id"
              component={ProductEdit}
            />
            <AdminRoutes path="/admin" component={AdminPage} />

            <Route path="/product/:id" component={ProductDetails} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />

            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
