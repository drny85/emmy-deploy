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
        width: '100%',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        {' '}
        <h3 style={{ marginLeft: '20px' }}>Adding a Product</h3>
      </div>

      <ProductForm />
    </div>
  );
};

export default AddProduct;
