import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../reduxStore/actions/products';
import { getCategories } from '../reduxStore/actions/categoryActions';
import ProductCard from '../components/cards/ProductCard';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';
import EmptyPage from '../components/EmptyPage';
import Loader from '../components/Loader';

const initialValues = {
  category: '',
};

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    minHeight: '100vh',
    marginTop: '5px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
}));

const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const linkRef = useRef();
  const dispatch = useDispatch();
  const [goto, setGoTo] = useState('');

  const { products, loading } = useSelector((state) => state.productsData);
  const { user } = useSelector((state) => state.userData);
  const { categories } = useSelector((state) => state.categoriesData);

  const goToDetails = (id) => {
    history.push(`/product/${id}`);
  };

  const handleChange = (e) => {
    setGoTo(e.target.value);
  };

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCategories());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (products.length === 0 && !loading) {
    return (
      <EmptyPage>
        <h4 style={{ marginBottom: '20px' }}>
          This page is under contruction or does not have any products listed
        </h4>
        {user && user.isAdmin && (
          <Button
            variant="contained"
            component={Link}
            to="/admin/product"
            color="primary"
          >
            Add my first product
          </Button>
        )}
      </EmptyPage>
    );
  }

  return (
    <div
      className="home"
      style={{
        display: 'flex',
        alignContent: 'center',
        justifyItems: 'center',
        margin: 'auto',
        maxWidth: '1700px',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyItems: 'center',
        }}
        className="select"
      >
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">
            View By category
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="View By Category"
            value={goto}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem
                className="capitalize"
                style={{ marginTop: '20px' }}
                key={category._id}
                value={category._id}
              >
                <Button fullWidth href={`#${category._id}`}>
                  {category.name}
                </Button>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Grid container alignContent="center">
        <Grid item>
          {categories.map((category) => {
            return (
              <section id={category._id} key={category._id}>
                <div className="items ">
                  {products.filter((p) => p.category._id === category._id)
                    .length > 0 && (
                    <h2
                      style={{ padding: '10px', marginTop: '00px' }}
                      className={`capitalize ${
                        goto === category._id
                          ? 'animate__animated animate__flash selected'
                          : ''
                      }`}
                    >
                      {category.name}
                    </h2>
                  )}

                  <Grid item container>
                    {products
                      .filter(
                        (product) => product.category._id === category._id
                      )
                      .map((item) => (
                        <Grid key={item._id} item>
                          <ProductCard
                            product={item}
                            onClick={() => goToDetails(item._id)}
                          />
                        </Grid>
                      ))}
                  </Grid>
                  <Divider variant="middle" />
                </div>
              </section>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
