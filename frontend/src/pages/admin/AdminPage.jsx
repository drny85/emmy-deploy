import { Container, Paper, Grid } from '@material-ui/core';
import React from 'react';

import './Admin.css';

const AdminPage = ({ history }) => {
  const goToPage = (page) => {
    history.push(page);
  };
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={5}
            onClick={() => goToPage('/admin/products')}
            className='admin_tile'
          >
            <div className='title'>
              <h4>Manage Products</h4>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={5}
            onClick={() => goToPage('/admin/category')}
            className='admin_tile'
          >
            <div className='title'>
              <h4>Manage Categories</h4>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={5}
            onClick={() => goToPage('/admin/orders')}
            className='admin_tile'
          >
            <div className='title'>
              <h4>Manage Orders</h4>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={5}
            onClick={() => goToPage('products')}
            className='admin_tile'
          >
            <div className='title'>
              <h4>Manage Users</h4>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Paper
            elevation={5}
            onClick={() => goToPage('admin/coupons')}
            className='admin_tile'
          >
            <div className='title'>
              <h4>Manage Coupons</h4>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
