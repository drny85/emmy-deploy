import {
  Grid,
  Paper,
  List,
  ListItem,
  Divider,
  Button,
  IconButton,
  CircularProgress,
  Backdrop,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import CartListItem from '../../components/CartListItem';
import { clearCart } from '../../reduxStore/actions/shoppingCart';
import axios from '../../utils/axios';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../../components/Loader';
import { Link, useHistory } from 'react-router-dom';
import Order from '../../models/Order';
import { placeOrder } from '../../reduxStore/actions/orderActions';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import responseError from '../../utils/responseError';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const COUPONS = [
  {
    _id: 1,
    code: 'dddd20',
    value: 20,
    expires: moment().add(1, 'hour'),
  },
];

const OrderSummary = () => {
  const classes = useStyles();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState({});
  const [error, setError] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const { cartItems, quantity, total } = useSelector((state) => state.cartData);
  const shipping = JSON.parse(localStorage.getItem('shippingAddress'));
  const [loadState, setLoadState] = useState({ loading: false, loaded: false });
  const [isPaid, setIsPaid] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypal = useRef();
  const { user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const history = useHistory();

  const createOrder = (data, actions) => {
    console.log(data);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: couponApplied
              ? parseFloat(newPrice).toFixed(2)
              : parseFloat(total).toFixed(2),
          },
        },
      ],
    });
  };

  const handleCoupon = async () => {
    try {
      if (coupon.length === 0) return;
      if (couponApplied) {
        setError(true);
        setCouponError('only one coupon allowed');
        setTimeout(() => {
          setError(false);
          setCouponError('');
        }, 3000);
        return;
      }
      const { data } = await axios.post('/api/coupons/get', { code: coupon });
      const found = data;
      setApplied(found);

      if (!found && coupon.length > 0) {
        setError(true);
        setCouponError('Invalid coupon');
        setTimeout(() => {
          setError(false);
          setCouponError('');
        }, 3000);
      } else if (found && coupon.length > 0) {
        const notExpired =
          Date.parse(found.expires) < Date.parse(new Date().toISOString());

        // check if coupon expired
        if (!notExpired) {
          //apply coupon
          const amountToApply = (total * found.value) / 100;
          const newTotal = total - amountToApply;
          setNewPrice(parseFloat(newTotal).toFixed(2));
          setCouponApplied(true);
          setCoupon('');
        } else {
          setError(true);
          setCouponError('Coupon expired');
        }
      }
    } catch (error) {
      const e = responseError(error);
      setError(true);
      setCouponError(e);
      setTimeout(() => {
        setError(false);
        setCouponError('');
      }, 3000);
    }
  };
  const onSuccess = async (details, data) => {
    setProcessing(true);
    setIsPaid(true);

    const paymentDetails = {
      orderId: data.orderID,
      order_time: details.create_time,
      payer_id: details.payer.payer_id,
      email: details.payer.email_address,
      name: details.payer.name
        ? details.payer.name.given_name + ' ' + details.payer.name.surname
        : null,
      status: details.status,
      amount: details.purchase_units[0].amount.value,
    };
    const customer = JSON.parse(localStorage.getItem('shippingAddress'));

    const order = new Order(
      {
        name: customer.name + ' ' + customer.lastName,
        phone: customer.phone,
        email: customer.email,
      },
      {
        street: customer.address,
        apt: customer.apt,
        city: customer.city,
        state: customer.state,
        zipcode: customer.zipcode,
      },
      cartItems,
      couponApplied
        ? parseFloat(newPrice).toFixed(2)
        : parseFloat(total).toFixed(2),
      paymentDetails,
      true,
      paymentDetails.order_time,
      false,
      null,
      null,
      user ? user._id : null,
      coupon ? coupon : null
    );

    if (details.status === 'COMPLETED') {
      const id = await dispatch(placeOrder(order));
      if (id) {
        dispatch(clearCart());
        setProcessing(false);
        history.replace(`/orders/${id}`);
        //localStorage.removeItem('shippingAddress');
      }
    } else {
      return;
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onCancel = (data) => {
    console.error('payment was cancelled');
    console.log(data);
  };

  useEffect(() => {
    const addPaypal = async () => {
      try {
        const { data } = await axios.get('/api/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setLoadState({ loading: false, loaded: true });
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error(error);
      }
    };

    if (!loadState.loading && !loadState.loaded) {
      setLoadState({ loading: true, loaded: false });
      addPaypal();
    }

    return () => {};
  }, [total, loadState.loaded, loadState.loading]);

  if (loadState.loading) return <Loader />;

  return (
    <Paper
      style={{
        width: '90vw',
        margin: 'auto',
        padding: '10px 0',
        maxWidth: '1200px',
      }}
    >
      <div
        className='summary'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          width: '100%',
        }}
      >
        <div
          className='top'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '10px 5px',
          }}
        >
          <Button
            color='secondary'
            variant='contained'
            component={Link}
            to='/cart'
          >
            Go to cart
          </Button>
          <h4>Order Summary</h4>
          <div />
        </div>

        <Grid container>
          <Grid item xs={12} md={7}>
            <Paper>
              <List>
                {cartItems.map((item) => {
                  const product = { ...item.product, qty: item.qty };
                  return (
                    <ListItem key={product._id}>
                      <CartListItem showIncreaser={false} product={product} />
                    </ListItem>
                  );
                })}
              </List>
              <Divider light />
              <div
                className='total bold'
                style={{
                  padding: '15px 0px',
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <p style={{ marginRight: 'auto', paddingLeft: '1.5rem' }}>
                  Items: {quantity}
                </p>
                <p style={{ marginRight: '10px' }}>
                  Total: $
                  <span
                    style={{
                      textDecorationLine: couponApplied ? 'line-through' : '',
                    }}
                  >
                    {parseFloat(total).toFixed(2)}
                  </span>{' '}
                </p>
                {couponApplied && (
                  <span
                    style={{
                      margin: '0px 8px',
                      color: couponApplied ? 'red' : '',
                    }}
                  >
                    ${parseFloat(newPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper style={{ padding: '1rem' }}>
              {shipping && (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <h4 style={{ paddingBottom: '1px' }}>
                      Customer Info{' '}
                      <span style={{ marginLeft: '12px' }}>
                        <IconButton onClick={() => history.goBack()}>
                          <EditIcon htmlColor='red' />
                        </IconButton>
                      </span>
                    </h4>
                    <p className='capitalize py-3'>
                      {shipping.name} {shipping.lastName}{' '}
                    </p>
                    <p className='capitalize py-3'>{shipping.phone}</p>
                    <p>{shipping.email}</p>
                  </div>
                  <div style={{ margin: '8px 0px' }}>
                    <h4 style={{ paddingBottom: '8px' }}>Shipping Address</h4>
                    <p className='capitalize py-3'>
                      {shipping.address}{' '}
                      <span style={{ textTransform: 'uppercase' }}>
                        {' '}
                        {shipping.apt}{' '}
                      </span>
                    </p>
                    <p className='capitalize py-3'>
                      {shipping.city}, {shipping.state} {shipping.zipcode}
                    </p>
                  </div>
                </>
              )}
              {couponApplied && (
                <Grid item container alignItems='center'>
                  <div style={{ margin: '10px 0px' }} className=''>
                    <p style={{ color: 'red' }}>
                      {applied.value}% coupon applied{' '}
                      <span>
                        <IconButton onClick={() => setCouponApplied(false)}>
                          <CloseIcon htmlColor='red' />
                        </IconButton>
                      </span>
                    </p>
                  </div>
                </Grid>
              )}
              <Grid
                item
                container
                alignItems='center'
                style={{ height: '80px' }}
              >
                <Grid item xs={8}>
                  <TextField
                    style={{ width: '100%' }}
                    label='Coupon Code'
                    value={coupon}
                    error={error}
                    helperText={couponError}
                    variant='outlined'
                    onChange={(e) => setCoupon(e.target.value)}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    onClick={handleCoupon}
                    color='secondary'
                    style={{ height: '100%', padding: '16px 4px' }}
                    variant='contained'
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
              <div className='coupon'></div>
              <div ref={paypal} className='payment_btn'>
                {loadState.loaded && (
                  <PayPalButton
                    shippingPreference='SET_PROVIDED_ADDRESS'
                    createOrder={createOrder}
                    onButtonReady={() =>
                      setLoadState({ loading: false, loaded: true })
                    }
                    onSuccess={onSuccess}
                    onError={onError}
                    onCancel={onCancel}
                  />
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Backdrop className={classes.backdrop} open={processing}>
        <CircularProgress color='primary' />
      </Backdrop>
    </Paper>
  );
};

export default OrderSummary;
