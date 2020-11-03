import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Container, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';

import { getProducts, deleteProduct } from '../../reduxStore/actions/products';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';
import EmptyPage from '../../components/EmptyPage';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    fontWeight: 'bold',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'column',
    minWidth: '80vw',
    marginTop: '15px',
  },
});

const ProductList = ({ history }) => {
  const classes = useStyles();
  const { products, loading } = useSelector((state) => state.productsData);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    // dispatch(getProducts());
  };
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (products.length === 0) {
    return (
      <EmptyPage>
        <h4 style={{ marginBottom: '20px' }}>There is no product listed yet</h4>

        <Button
          variant='contained'
          component={Link}
          to='/admin/product'
          color='primary'
        >
          Add my first product
        </Button>
      </EmptyPage>
    );
  }

  return (
    <div className={classes.root}>
      <Container>
        <Grid container alignContent='center'>
          <Grid item xs={4}>
            <Button
              variant='outlined'
              startIcon={<ArrowBackIcon />}
              color='primary'
              onClick={() => history.goBack()}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography align='center' variant='h4'>
              Products List
            </Typography>
          </Grid>
          <Grid item sx={4}>
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              color='primary'
              component={Link}
              to='/admin/product'
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
        <div style={{ marginBottom: '8px' }} />
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label='sticky table'
          >
            <TableHead
              style={{
                fontWeight: 'bold',
                background:
                  'linear-gradient(90deg, rgba(52,56,55,0.7231267507002801), #ffffff)',
              }}
            >
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align='center'>Available</TableCell>
                <TableCell align='center'>Delivery In</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, i) => (
                <TableRow key={product._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className='capitalize' component='th' scope='row'>
                    {product.name}
                  </TableCell>

                  <TableCell>${product.price}</TableCell>
                  <TableCell className='capitalize'>
                    {product.category.name}
                  </TableCell>
                  <TableCell align='center'>
                    {product.available ? (
                      <CheckIcon color='primary' />
                    ) : (
                      <CloseIcon color='secondary' />
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    {product.estimatedDelivery}
                  </TableCell>
                  <TableCell align='center'>
                    <>
                      <EditOutlinedIcon
                        style={{ marginRight: '15px' }}
                        onClick={() =>
                          history.push(`/admin/product/edit/${product._id}`)
                        }
                      />
                      <DeleteForeverIcon
                        htmlColor='red'
                        onClick={() => handleDelete(product._id)}
                      />
                    </>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default ProductList;
