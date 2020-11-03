import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrderById,
  resetOrder,
  updateOrder,
} from '../../reduxStore/actions/orderActions';
import Loader from '../../components/Loader';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  Paper,
  TextField,
} from '@material-ui/core';
import CartListItem from '../../components/CartListItem';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.ordersData);
  const { user } = useSelector((state) => state.userData);
  const [show, setShow] = useState(false);
  const [tracking, setTracking] = useState('');

  useEffect(() => {
    dispatch(getOrderById(id));

    return () => {
      dispatch(resetOrder());
    };
  }, [id, dispatch]);

  const handleUpdate = () => {
    order.isDelivered = true;
    order.trackingNumber = tracking;
    order.deliveredOn = new Date().toISOString();
    dispatch(updateOrder(order));
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
    setTracking('');
  };

  if (loading) return <Loader />;

  if (!order) return <Loader />;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90vw',
        margin: 'auto',
        maxWidth: '1200px',
      }}
    >
      <Paper style={{ width: '100%' }}>
        <Grid container>
          <Grid item xs={12} style={{ margin: '20px 8px' }}>
            <h3 style={{ textAlign: 'center' }}>Order Details</h3>
          </Grid>

          <Divider light />
          <Grid item xs={12} md={6}>
            <List component='ul'>
              <ListItem>
                <p className='capitalize'>Order ID: {order._id}</p>
              </ListItem>
              <ListItem>
                <p className='capitalize'>
                  Order Date: {new Date(order.placedOn).toLocaleString()}
                </p>
              </ListItem>
              <Divider light />
              <ListItem>
                <p className='capitalize bold'>Customer Info</p>
              </ListItem>
              <ListItem>
                <p className='capitalize'>Name: {order.customer.name}</p>
              </ListItem>
              <ListItem>
                <p className='capitalize'>Phone: {order.customer.phone}</p>
              </ListItem>
              <ListItem>
                <p>Email: {order.customer.email}</p>
              </ListItem>
              <Divider light />
              <ListItem>
                <p className='capitalize bold'>Shipping Address</p>
              </ListItem>
              <ListItem>
                <p className='capitalize'>
                  {order.shippingAddress.street}{' '}
                  {order.shippingAddress.apt && order.shippingAddress.apt}
                </p>
              </ListItem>
              <ListItem>
                <p className='capitalize'>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipcode}
                </p>
              </ListItem>
              <Divider light />
              <ListItem>
                <p className='capitalize'>Payment Status: </p>
                <span style={{ marginLeft: '8px' }}>
                  {order.isPaid ? (
                    <Chip
                      color='secondary'
                      variant='outlined'
                      label='Paid'
                      icon={<CheckIcon htmlColor='green' />}
                    />
                  ) : (
                    <Chip
                      label='Not paid'
                      color='default'
                      icon={<NotInterestedIcon htmlColor='red' />}
                    />
                  )}
                </span>{' '}
              </ListItem>
              <ListItem>
                <p className='capitalize'>
                  Delivery Status:{' '}
                  <span>
                    {order.isDelivered ? (
                      <>
                        <Button
                          variant='contained'
                          component={Link}
                          href={`https://www.google.com/search?q=${order.trackingNumber}`}
                          target='_black'
                        >
                          Track Order
                        </Button>
                        {user && user.isAdmin && order.isDelivered && (
                          <span style={{ marginLeft: '10px' }}>
                            <Button
                              size='small'
                              variant='outlined'
                              color='secondary'
                              onClick={() => setShow(true)}
                            >
                              Update Tracking Number
                            </Button>
                          </span>
                        )}
                      </>
                    ) : user && user.isAdmin ? (
                      <span style={{ marginRight: '10px' }}>
                        <Button
                          size='small'
                          variant='outlined'
                          color='secondary'
                          onClick={() => setShow(true)}
                        >
                          Add Tracking Number
                        </Button>
                      </span>
                    ) : (
                      'pending'
                    )}
                  </span>
                </p>
              </ListItem>
              {order.deliveredOn && (
                <ListItem>
                  <p className='capitalize'>
                    Delivered On: {new Date(order.deliveredOn).toLocaleString()}
                  </p>
                </ListItem>
              )}
              <ListItem>
                <p className='capitalize'>Order Total: ${order.orderTotal}</p>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <h5 style={{ textAlign: 'center' }}>Items Ordered</h5>

            <List>
              {order.orderItems.map((item) => {
                const product = { ...item.product, qty: item.qty };
                return (
                  <ListItem key={product._id}>
                    <CartListItem showIncreaser={false} product={product} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
        <Dialog open={show}>
          <DialogContent>
            <DialogContentText>Adding Tracking Number</DialogContentText>
            <TextField
              id='outlined-basic'
              label='Tracking Number'
              style={{ width: '300px' }}
              variant='outlined'
              inputProps={{ style: { textTransform: 'uppercase' } }}
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              style={{ color: 'red' }}
              onClick={handleClose}
              color='primary'
            >
              Cancel
            </Button>
            <Button
              style={{ color: 'green' }}
              onClick={handleUpdate}
              color='primary'
              autoFocus
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default OrderDetails;
