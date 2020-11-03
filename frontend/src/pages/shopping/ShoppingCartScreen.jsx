import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartListItem from '../../components/CartListItem';
import { makeStyles } from '@material-ui/core/styles';
import { clearCart } from '../../reduxStore/actions/shoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: theme.palette.primary,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '90vw',
    maxWidth: '1300px',
    margin: '20px auto',
    justifyContents: 'center',
  },
}));

const ShoppingCartScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const emptyCartHandler = async () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const emptyCart = () => {
    dispatch(clearCart());
    setShow(false);
  };

  const { cartItems, total } = useSelector((state) => state.cartData);

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '80vh',
        }}
      >
        <h3 style={{ margin: '1rem' }}>Your cart is empty</h3>
        <Button
          startIcon={<ShoppingBasketIcon />}
          variant='contained'
          color='primary'
          component={Link}
          to='/'
        >
          Go Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={8}>
          {' '}
          <Typography variant='h5'>Shopping Cart</Typography>
        </Grid>
        <Grid item xs={4}>
          {cartItems.length > 0 && (
            <Button
              variant='outlined'
              color='primary'
              size='small'
              onClick={emptyCartHandler}
              className={classes.btn}
            >
              Clear Cart
            </Button>
          )}
        </Grid>
      </Grid>

      <Paper style={{ padding: '1rem', marginTop: '1rem' }}>
        <Grid item container>
          <Grid item xs={12} sm={12}>
            <List>
              {cartItems.map((item) => {
                const product = { ...item.product, qty: item.qty };
                return (
                  <ListItem key={product._id}>
                    <CartListItem product={product} showIncreaser={true} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={12} sm={4}></Grid>
        </Grid>

        <Grid item xs={12}>
          <div style={{ height: '8px' }} />
          <Divider light />
        </Grid>
        <Grid item xs={12}>
          <h4 style={{ padding: '1rem' }}>
            Your Cart total: ${parseFloat(total).toFixed(2)}
          </h4>
        </Grid>
        <div style={{ height: '8px' }} />
        <Grid item container>
          <Grid item xs={12}>
            <Button
              variant='contained'
              style={{ marginRight: '10px' }}
              color='primary'
              onClick={() => history.push('/')}
            >
              Shop More
            </Button>
            <Button
              startIcon={<PaymentIcon />}
              variant='contained'
              color='secondary'
              onClick={() => history.push('/shipping')}
            >
              CheckOut
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={show} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Are you sure that you want to empty the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            No
          </Button>
          <Button
            style={{ color: 'red' }}
            onClick={emptyCart}
            color='primary'
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShoppingCartScreen;
