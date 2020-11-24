import { Grid } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import ProductForm from '../../components/forms/ProductForm';

const AddProduct = () => {
  const [preview, setPreview] = useState();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15px',
        flexDirection: 'column',
      }}
    >
      <h3>Adding a Product</h3>

      <Grid container>
        <Grid item xs={12} med={7}>
          <ProductForm />
        </Grid>
        <Grid item xs={12} md={5}></Grid>
      </Grid>
    </div>
  );
};

export default AddProduct;
