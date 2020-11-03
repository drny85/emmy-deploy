import {
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Hidden,
  IconButton,
} from '@material-ui/core';
import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../reduxStore/actions/shoppingCart';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';

import CartItem from '../models/CartItem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const CartListItem = ({ product, showIncreaser = true }) => {
  const dispatch = useDispatch();
  const { qty, price, name } = product;
  const classes = useStyles();

  const handleDelete = () => {
    dispatch(removeFromCart(product));
  };

  const handleAddToCart = () => {
    const item = new CartItem(product, 1, product.price);
    dispatch(addToCart(item));
  };

  return (
    <Grid
      container
      justify='space-around'
      alignItems='center'
      className='cart_list_item'
    >
      <Hidden smDown>
        <Grid item xs={4} md={3}>
          <Avatar src={product.imageUrl} className={classes.small} />
        </Grid>
      </Hidden>

      <Grid item xs={4} md={3}>
        <h6 className='capitalize'>{name}</h6>
        <p>
          {qty} x {price}
        </p>
      </Grid>
      {showIncreaser && (
        <Grid item xs={4} md={3}>
          <ButtonGroup
            color='primary'
            size='small'
            aria-label='outlined primary button group'
          >
            <Button onClick={handleDelete}>
              <RemoveRoundedIcon />
            </Button>
            <Button>{qty}</Button>
            <Button onClick={handleAddToCart}>
              <AddRoundedIcon />
            </Button>
          </ButtonGroup>
        </Grid>
      )}
      <Hidden smDown>
        <Grid item xs={4} md={3}>
          <p className='bold'>${parseFloat(price * qty).toFixed(2)}</p>
        </Grid>
      </Hidden>

      <Divider light />
    </Grid>
  );
};

export default CartListItem;
