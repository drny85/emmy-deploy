import {
  Table,
  TableContainer,
  Paper,
  makeStyles,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../reduxStore/actions/orderActions';
import Loader from '../../components/Loader';
import EmptyPage from '../../components/EmptyPage';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },

  cell: {
    backgroundColor: theme.palette.action.focus,
    fontWeight: 'bold',
  },
}));

const AdminOrdersPage = ({ history }) => {
  const { orders, loading } = useSelector((state) => state.ordersData);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (loading) return <Loader />;
  console.log(loading);

  if (orders.length === 0) {
    return (
      <EmptyPage>
        <h4>There is no orders to show.</h4>
      </EmptyPage>
    );
  }
  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <div
        className='title'
        style={{
          padding: '15px 0px',

          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          variant='outlined'
          style={{ marginRight: '40px' }}
          startIcon={<ArrowBackIcon />}
          color='primary'
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        <h3>Manage Orders</h3>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>Customer</TableCell>
              <TableCell className={classes.cell}>Address</TableCell>
              <TableCell className={classes.cell}>Amount</TableCell>
              <TableCell className={classes.cell}>Date</TableCell>
              <TableCell className={classes.cell}>Delivered</TableCell>
              <TableCell className={classes.cell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className='capitalize'>
                  {order.customer.name}
                </TableCell>
                <TableCell className='capitalize'>
                  {order.shippingAddress.street} {order.shippingAddress.state}
                </TableCell>
                <TableCell>${order.orderTotal}</TableCell>
                <TableCell>
                  {new Date(order.placedOn).toLocaleString()}
                </TableCell>
                <TableCell>{order.deliveredOn ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => history.push(`/orders/${order._id}`)}
                  >
                    <EditIcon color='primary' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminOrdersPage;
